import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg border-2 border-red-200">
                <h1 className="text-3xl font-bold mb-4">Jejda, něco se pokazilo.</h1>
                <p className="mb-6">Omlouváme se za potíže. Zkuste prosím obnovit stránku.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    Obnovit stránku
                </button>
                {this.state.error && (
                    <pre className="mt-4 p-2 bg-red-100 text-left text-sm rounded overflow-auto max-h-48">
                        {this.state.error.toString()}
                    </pre>
                )}
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
