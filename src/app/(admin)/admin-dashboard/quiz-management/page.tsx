const QuizManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quiz Creation</h1>
        <p className="text-muted-foreground">Create and manage quizzes for NEET PG preparation</p>
      </div>

      <div className="bg-card p-8 rounded-lg border border-border shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-2xl">🚧</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            Quiz creation functionality will be integrated with external question bank APIs to provide comprehensive NEET PG question management.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <h3 className="font-medium text-foreground mb-2">Planned Features:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Subject-wise question filtering</li>
              <li>• Module-based organization</li>
              <li>• Multiple choice questions with explanations</li>
              <li>• Video solutions integration</li>
              <li>• Automatic grading system</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;