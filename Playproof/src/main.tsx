import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App";

// QueryClient 인스턴스 생성 및 옵션 설정
const queryClient = new QueryClient({

	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 0,
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{/* App을 QueryClientProvider로 감싸주어야 합니다 */}
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>
);
