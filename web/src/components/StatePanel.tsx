const StatePanel = ({ state, message }: { state: 'loading' | 'empty' | 'error' | 'success'; message: string }) => {
  return (
    <div className="text-center p-8">
      {state === 'loading' && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {state === 'empty' && <p className="text-muted">{message}</p>}
      {state === 'error' && <p className="text-red-500">{message}</p>}
      {state === 'success' && <p className="text-success">{message}</p>}
    </div>
  );
};

export default StatePanel;