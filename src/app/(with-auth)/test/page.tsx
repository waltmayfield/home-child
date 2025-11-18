'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function TestPage() {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <div>
      <h1>Test Page</h1>
      {user ? (
        <div>
          <p>User is authenticated</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <p>No authenticated user</p>
      )}
    </div>
  );
}   