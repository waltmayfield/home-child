# Activity Data Guide

This guide explains how to interact with the `data/Activity.jsonl` file, which contains sample activity data for the home-child application.

## File Format

The file uses JSONL (JSON Lines) format, where each line is a separate JSON object representing one activity. This format is ideal for:
- Processing large datasets line by line
- Appending new records without parsing the entire file
- Easy integration with streaming data processors

## Schema Structure

Each activity follows the schema defined in `amplify/data/resource.ts`:

```json
{
  "title": "string (required)",
  "description": "string (required)", 
  "materials": ["array", "of", "strings"],
  "instructions": ["step-by-step", "markdown", "formatted"],
  "targetAgeRange": {
    "minAge": "integer (required)",
    "maxAge": "integer (required)"
  },
  "category": "ActivityCategories enum (required)",
  "skillsTargeted": ["Skills", "enum", "array"],
  "difficultyLevel": "beginner|intermediate|advanced",
  "duration": {
    "estimatedMinutes": "integer (required)",
    "flexible": "boolean (required)"
  },
  "settingRequirements": ["array", "of", "strings"],
  "supervisionLevel": "independent|minimal_supervision|active_supervision|one_on_one_required",
  "messLevel": "none|minimal|moderate|high",
  "tags": ["searchable", "tags"],
  "owner": "string (auto-generated)",
  "createdAt": "ISO 8601 datetime (auto-generated)"
}
```

## Using jq to Query Activities

### Basic Queries

**View all activities (pretty-printed):**
```bash
jq '.' data/Activity.jsonl
```

**Get just activity titles:**
```bash
jq '.title' data/Activity.jsonl
```

**Count total activities:**
```bash
jq -s 'length' data/Activity.jsonl
```

### Filtering Activities

**Find beginner activities:**
```bash
jq 'select(.difficultyLevel == "beginner") | .title' data/Activity.jsonl
```

**Activities for specific age groups:**
```bash
# Activities suitable for toddlers (age 3 and under)
jq 'select(.targetAgeRange.minAge <= 3) | {title, minAge: .targetAgeRange.minAge, maxAge: .targetAgeRange.maxAge}' data/Activity.jsonl

# Activities for school-age children (6+)
jq 'select(.targetAgeRange.minAge >= 6) | .title' data/Activity.jsonl
```

**Filter by category:**
```bash
jq 'select(.category == "arts_crafts") | .title' data/Activity.jsonl
```

**Low-mess activities:**
```bash
jq 'select(.messLevel == "none" or .messLevel == "minimal") | .title' data/Activity.jsonl
```

**Quick activities (30 minutes or less):**
```bash
jq 'select(.duration.estimatedMinutes <= 30) | {title, minutes: .duration.estimatedMinutes}' data/Activity.jsonl
```

### Aggregation Queries

**Group by category:**
```bash
jq -s 'group_by(.category) | map({category: .[0].category, count: length})' data/Activity.jsonl
```

**Average duration by difficulty level:**
```bash
jq -s 'group_by(.difficultyLevel) | map({difficulty: .[0].difficultyLevel, avgMinutes: (map(.duration.estimatedMinutes) | add / length)})' data/Activity.jsonl
```

**Skills frequency analysis:**
```bash
jq -s '[.[].skillsTargeted[]] | group_by(.) | map({skill: .[0], count: length}) | sort_by(-.count)' data/Activity.jsonl
```

### Complex Queries

**Find activities matching multiple criteria:**
```bash
# Beginner arts & crafts for ages 3-6
jq 'select(.difficultyLevel == "beginner" and .category == "arts_crafts" and .targetAgeRange.minAge <= 6)' data/Activity.jsonl
```

**Activities by supervision level:**
```bash
jq -s 'group_by(.supervisionLevel) | map({supervision: .[0].supervisionLevel, activities: map(.title)})' data/Activity.jsonl
```

**Find activities with specific skills:**
```bash
jq 'select(.skillsTargeted | contains(["fine_motor"])) | .title' data/Activity.jsonl
```

## Data Management

### Adding New Activities

To add a new activity, append a new JSON object to the file:

```bash
echo '{"title":"New Activity","description":"...","category":"arts_crafts",...}' >> data/Activity.jsonl
```

### Validation

**Check for required fields:**
```bash
jq 'select(.title == null or .description == null or .category == null) | .title // "MISSING TITLE"' data/Activity.jsonl
```

**Validate age ranges:**
```bash
jq 'select(.targetAgeRange.minAge > .targetAgeRange.maxAge) | "Invalid age range: " + .title' data/Activity.jsonl
```

### Export Formats

**Convert to standard JSON array:**
```bash
jq -s '.' data/Activity.jsonl > activities.json
```

**Export specific fields as CSV:**
```bash
jq -r '[.title, .category, .difficultyLevel, .duration.estimatedMinutes] | @csv' data/Activity.jsonl > activities.csv
```

**Create activity summary:**
```bash
jq '{title, category, ages: "\(.targetAgeRange.minAge)-\(.targetAgeRange.maxAge)", duration: .duration.estimatedMinutes}' data/Activity.jsonl
```

## Integration with Amplify

This JSONL file serves as seed data for the Amplify backend. The activities can be imported into the database using the AWS Amplify Admin UI or through GraphQL mutations.

### Example GraphQL Mutation

```graphql
mutation CreateActivity($input: CreateActivityInput!) {
  createActivity(input: $input) {
    id
    title
    category
    difficultyLevel
    targetAgeRange {
      minAge
      maxAge
    }
  }
}
```

## Available Categories

- `arts_crafts`
- `science_experiments`
- `outdoor_activities`
- `cooking_baking`
- `reading_literacy`
- `math_numbers`
- `music_dance`
- `physical_exercise`
- `building_construction`
- `dramatic_play`
- `sensory_play`
- `nature_exploration`

## Available Skills

- `creativity`
- `critical_thinking`
- `fine_motor`
- `gross_motor`
- `social_emotional`
- `language_development`
- `problem_solving`
- `sensory_processing`
- `self_regulation`
- `collaboration`
- `independence`
- `curiosity`

## Tips

1. **Performance**: Use `jq -s` for operations that need the entire dataset, but avoid it for large files
2. **Streaming**: Process line by line for memory efficiency with large datasets
3. **Validation**: Regularly check data integrity using the validation queries above
4. **Backup**: Always backup the file before making bulk modifications