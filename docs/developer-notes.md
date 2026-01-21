# Developer Notes

## Summary of recent changes

- Added an optional `description` field to the `Child` model in `amplify/data/resource.ts`.
- Updated the activities UI to persist the free-text description when creating a child (`src/app/(with-auth)/activities/page.tsx`).
- Updated onboarding flow to create a `Child` record during `create-profile` using AI-generated defaults (`src/app/(without-auth)/onboarding/create-profile/page.tsx`). The onboarding flow approximates a `birthday` from the provided `age` because onboarding collects age, not birth date.
- Updated the child profile page to show and edit the `description` (`src/app/(with-auth)/children/[id]/page.tsx`).

## Important commands (Amplify Gen2 / ampx)

- Run the local sandbox backend to pick up schema changes:

```bash
npx ampx sandbox
```

- After schema changes, regenerate GraphQL client code in this repo with:

```bash
npx ampx generate graphql-client-code --out amplify/graphql
```

Notes:
- For this repository we use Amplify Gen2 tooling (`ampx`). You generally develop locally in the sandbox (`npx ampx sandbox`) and regenerate client code after schema changes. When you're ready to deploy to a remote environment, use your CI/deploy process for remote builds.

## Notes on deployments and codegen

- I added the `description` field to the `Child` model in the local `amplify/data/resource.ts` schema. For the backend to store the field you must deploy the schema changes to your sandbox or production environment (see commands above).
- After deploying, run the GraphQL client generation command above to update any generated GraphQL clients and types used elsewhere in the repo.
- The UI already sends `description` in calls to `client.models.Child.create` and `client.models.Child.update` in the updated pages. If codegen or the backend is out-of-sync you may see runtime validation errors from the backend until the schema is deployed.

## UI flows and notes

- Onboarding (`/onboarding/describe-child` -> `/onboarding/create-profile`):
  - User supplies name, age, and a free-text description.
  - The app calls the `generateDefaultFilterAndInterests` generation to create `defaultFilter` + `interests` using AI.
  - On Continue, the app creates a `Child` record with: `name`, approximated `birthday`, `description`, `interests`, `defaultFilter`.

- Activities page (`/activities`):
  - When creating a child from the activities page, the description field is persisted.

- Child profile (`/children/[id]`):
  - The profile now displays `description` (if present) and allows editing it.


## Next recommended tasks

- If you haven't already run them for the current changes, run the sandbox and client codegen commands above so the backend and generated types are in sync.
- Update any other places that create `Child` records (if present) to include `description`.
- Add tests to verify create/update flows include `description`.

If you'd like, I can also:
- Patch remaining onboarding pages or places that create Child (I already updated the main onboarding create flow and activities page).
- Run the codegen/verify steps locally here (if you want me to attempt them).

---

Notes recorded on: 2026-01-20
