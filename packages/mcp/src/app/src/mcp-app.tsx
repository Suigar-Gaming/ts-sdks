// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { type McpUiHostContext, useApp, useHostStyles } from '@modelcontextprotocol/ext-apps/react';
import type { CallToolResult } from '@modelcontextprotocol/server';
import { type JSX, StrictMode, useEffect, useReducer, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
	ExecutionApproval,
	Header,
	ListPanel,
	Panel,
	RawPayload,
} from './components/inspector-components.js';
import { asRecord } from './lib/format.js';
import { getToolResultPayload } from './lib/tool-result.js';
import type { InspectorState } from './lib/types.js';
import { resolveAppView } from './views/index.js';

const initialState: InspectorState = {
	status: 'Waiting for tool result',
	payload: {},
	errors: [],
};

const shellClassName =
	'mx-auto grid min-h-dvh max-w-6xl content-start gap-4 bg-background p-3.5 text-foreground sm:p-4.5';

function textErrors(result: CallToolResult): Array<string> {
	return (
		result.content?.flatMap((item) => (item.type === 'text' && item.text ? [item.text] : [])) ?? []
	);
}

type AppViewState = {
	error: Error | null;
	hostContext: McpUiHostContext | undefined;
	inspector: InspectorState | null;
};

type AppViewAction =
	| {
			type: 'host-context';
			context: McpUiHostContext | undefined;
	  }
	| {
			type: 'tool-input';
	  }
	| {
			type: 'tool-result';
			payload: unknown;
			status: string;
	  }
	| {
			type: 'tool-error';
			errors: Array<string>;
			payload: unknown;
	  };

function reduceAppViewState({
	state,
	action,
}: {
	state: AppViewState;
	action: AppViewAction;
}): AppViewState {
	switch (action.type) {
		case 'host-context':
			return action.context
				? { ...state, hostContext: { ...state.hostContext, ...action.context } }
				: state;
		case 'tool-input':
			// Keep the last result visible while a host starts or repeats a tool call.
			// Some hosts can deliver tool-input after the app has already rendered.
			return state;
		case 'tool-result':
			return {
				...state,
				inspector: {
					status: action.status,
					payload: action.payload,
					errors: [],
				},
			};
		case 'tool-error':
			return {
				...state,
				inspector: {
					status: 'Error',
					payload: action.payload,
					errors: action.errors,
				},
			};
	}
}

function reducer(state: AppViewState, action: AppViewAction): AppViewState {
	return reduceAppViewState({ state, action });
}

export function SuigarInspectorApp(): JSX.Element | null {
	const [viewState, dispatch] = useReducer(reducer, {
		error: null,
		hostContext: undefined,
		inspector: null,
	});
	const removeAppListeners = useRef<(() => void) | null>(null);
	useEffect(
		() => () => {
			removeAppListeners.current?.();
			removeAppListeners.current = null;
		},
		[],
	);

	const { app, error, isConnected } = useApp({
		appInfo: {
			name: 'suigar-mcp-app',
			version: __SUIGAR_MCP_APP_VERSION__,
		},
		capabilities: {},
		onAppCreated: (createdApp) => {
			removeAppListeners.current?.();
			const onToolInput = () => {
				dispatch({ type: 'tool-input' });
			};

			const onToolResult = (result: CallToolResult) => {
				if (result.isError) {
					const errors = textErrors(result);
					dispatch({
						type: 'tool-error',
						payload: result,
						errors: errors.length > 0 ? errors : ['Tool call failed.'],
					});
					return;
				}

				const payload = getToolResultPayload(result);
				const execution = asRecord(payload.execution);
				dispatch({
					type: 'tool-result',
					status:
						typeof payload.mode === 'string'
							? payload.mode
							: typeof execution.status === 'string'
								? execution.status
								: 'read',
					payload,
				});
			};

			const onHostContextChanged = (context: McpUiHostContext) => {
				dispatch({ type: 'host-context', context });
			};

			createdApp.addEventListener('toolinput', onToolInput);
			createdApp.addEventListener('toolresult', onToolResult);
			createdApp.addEventListener('hostcontextchanged', onHostContextChanged);
			removeAppListeners.current = () => {
				createdApp.removeEventListener('toolinput', onToolInput);
				createdApp.removeEventListener('toolresult', onToolResult);
				createdApp.removeEventListener('hostcontextchanged', onHostContextChanged);
			};
		},
	});
	const hostContext = app?.getHostContext();
	useHostStyles(app, hostContext);

	useEffect(() => {
		if (!app) {
			return;
		}
		const context = app.getHostContext();
		dispatch({ type: 'host-context', context });
	}, [app]);

	const inspector = viewState.inspector ?? initialState;
	const { coinBadge, title, View } = resolveAppView(inspector.payload);
	const execution = asRecord(asRecord(inspector.payload).execution);
	const approvalUrl = typeof execution.approvalUrl === 'string' ? execution.approvalUrl : null;
	const viewError = error ?? viewState.error;
	const safeAreaInsets = viewState.hostContext?.safeAreaInsets;
	const safeAreaStyle = {
		paddingTop: safeAreaInsets?.top,
		paddingRight: safeAreaInsets?.right,
		paddingBottom: safeAreaInsets?.bottom,
		paddingLeft: safeAreaInsets?.left,
	};

	if (viewError) {
		return (
			<main className={shellClassName} style={safeAreaStyle}>
				<Header status="Error" title={title} />
				<ListPanel className="errors" items={[viewError.message]} title="Errors" />
			</main>
		);
	}

	if (!isConnected) {
		return (
			<main className={shellClassName} style={safeAreaStyle}>
				<Header status="Connecting" title="Suigar MCP" />
				<Panel title="Connection">
					<p className="text-muted-foreground text-xs leading-5 font-semibold">
						Connecting to host.
					</p>
				</Panel>
			</main>
		);
	}

	if (Object.keys(asRecord(inspector.payload)).length === 0) {
		if (inspector.errors.length === 0) {
			return (
				<main className={shellClassName} style={safeAreaStyle}>
					<Header status="Waiting for tool result" title="Suigar MCP" />
					<Panel title="Tool result">
						<p className="text-muted-foreground text-xs leading-5 font-semibold">
							The app is connected, but the host has not delivered a readable tool result.
						</p>
					</Panel>
				</main>
			);
		}
	}

	if (inspector.errors.length > 0) {
		return (
			<main className={shellClassName} style={safeAreaStyle}>
				<Header status="Error" title="Tool Error" />
				<ListPanel className="errors" items={inspector.errors} title="Unable to complete request" />
			</main>
		);
	}

	return (
		<main className={shellClassName} style={safeAreaStyle}>
			<Header coinBadge={coinBadge} status={inspector.status} title={title} />
			<ExecutionApproval url={approvalUrl} />
			<View payload={inspector.payload} errors={inspector.errors} />
			<RawPayload payload={inspector.payload} />
		</main>
	);
}

createRoot(document.querySelector<HTMLDivElement>('#root')!).render(
	<StrictMode>
		<SuigarInspectorApp />
	</StrictMode>,
);
