# Child Default Filters Guide

This guide explains how to implement and use the child default filters feature in the Home Child activity app.

## Overview

The child default filters feature allows parents to set personalized activity preferences for each child. When a child is selected, their saved filter preferences are automatically applied, providing a tailored activity browsing experience.

## Data Model

### Child Model with Default Filters

The `Child` model now includes a `defaultFilter` field that stores the parent's preferences:

```typescript
Child: {
  name: string
  sex: 'male' | 'female'
  birthday: date
  interests: string[]
  defaultFilter: {
    categories?: ActivityCategory[]        // Preferred activity types
    skills?: Skill[]                      // Target skills to develop
    difficultyLevel?: DifficultyLevel     // Preferred difficulty
    maxDuration?: number                  // Max activity duration (minutes)
    messLevel?: MessLevel                 // Acceptable mess level
    supervisionLevel?: SupervisionLevel   // Required supervision
    ageRangeOverride?: {                  // Custom age range
      minAge?: number
      maxAge?: number
    }
  }
}
```

## Implementation Guide

### 1. Setting Up Child Default Filters

#### Creating a Child with Default Filters

```typescript
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

// Create a new child with default filter preferences
const createChildWithDefaults = async (childData: {
  name: string;
  birthday: string;
  sex: 'male' | 'female';
  defaultPreferences: any;
}) => {
  const result = await client.models.Child.create({
    name: childData.name,
    birthday: childData.birthday,
    sex: childData.sex,
    defaultFilter: {
      messLevel: 'minimal',
      maxDuration: 45,
      supervisionLevel: 'minimal_supervision',
      categories: ['arts_crafts', 'science_experiments'],
      skills: ['creativity', 'fine_motor'],
      difficultyLevel: 'beginner'
    }
  });
  return result;
};
```

#### Updating Child Default Filters

```typescript
const updateChildDefaults = async (childId: string, newDefaults: DefaultChildFilter) => {
  const result = await client.models.Child.update({
    id: childId,
    defaultFilter: newDefaults
  });
  return result;
};
```

### 2. Using Default Filters in Activity Lists

#### Import Required Utilities

```typescript
import { 
  createDefaultFilterFromChild,
  mergeWithChildDefaults,
  type ActivityFilters,
  type DefaultChildFilter
} from "@/../amplify/shared/constants";
```

#### Apply Child Defaults to Activity Filters

```typescript
const ActivitiesPage = () => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [filters, setFilters] = useState<ActivityFilters>({});

  // When a child is selected, apply their default filters
  const handleChildSelection = (child: Child) => {
    setSelectedChild(child);
    
    // Create default filters based on child's profile
    const childDefaults = createDefaultFilterFromChild({
      birthday: child.birthday,
      interests: child.interests,
      defaultFilter: child.defaultFilter
    });
    
    // Apply the defaults
    setFilters(childDefaults);
  };

  // Merge user's current selections with child defaults
  const handleFilterUpdate = (key: keyof ActivityFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    
    if (selectedChild) {
      const childDefaults = createDefaultFilterFromChild(selectedChild);
      const mergedFilters = mergeWithChildDefaults(updatedFilters, childDefaults);
      setFilters(mergedFilters);
    } else {
      setFilters(updatedFilters);
    }
  };
};
```

### 3. Age-Based Auto-Filtering

The system automatically calculates appropriate age ranges based on the child's birthday:

```typescript
// For a 5-year-old child:
// - Default minAge: 4 (age - 1)
// - Default maxAge: 7 (age + 2)

// Custom age override example:
const childWithCustomAgeRange = {
  birthday: '2018-06-15', // 7 years old
  defaultFilter: {
    ageRangeOverride: {
      minAge: 5,  // Show activities for 5+ years
      maxAge: 10  // Up to 10 years
    }
  }
};
```

## UI Implementation Examples

### Child Selector Component

```typescript
const ChildSelector = ({ 
  children, 
  selectedChild, 
  onChildSelect 
}: {
  children: Child[];
  selectedChild: Child | null;
  onChildSelect: (child: Child) => void;
}) => {
  return (
    <div className="flex gap-2 mb-4">
      {children.map(child => (
        <button
          key={child.id}
          onClick={() => onChildSelect(child)}
          className={`px-4 py-2 rounded-lg ${
            selectedChild?.id === child.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {child.name}
        </button>
      ))}
    </div>
  );
};
```

### Default Filter Settings Form

```typescript
const ChildDefaultsForm = ({ 
  child, 
  onSave 
}: {
  child: Child;
  onSave: (defaults: DefaultChildFilter) => void;
}) => {
  const [defaults, setDefaults] = useState<DefaultChildFilter>(
    child.defaultFilter || {}
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(defaults); }}>
      <div className="space-y-4">
        {/* Mess Level */}
        <div>
          <label>Preferred Mess Level</label>
          <select 
            value={defaults.messLevel || ''} 
            onChange={(e) => setDefaults({
              ...defaults, 
              messLevel: e.target.value as MessLevel
            })}
          >
            <option value="">Any</option>
            <option value="none">None</option>
            <option value="minimal">Minimal</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Max Duration */}
        <div>
          <label>Maximum Duration (minutes)</label>
          <input 
            type="number"
            value={defaults.maxDuration || ''}
            onChange={(e) => setDefaults({
              ...defaults,
              maxDuration: e.target.value ? Number(e.target.value) : undefined
            })}
          />
        </div>

        {/* Preferred Categories */}
        <div>
          <label>Preferred Activity Categories</label>
          {ACTIVITY_CATEGORIES.map(category => (
            <label key={category} className="flex items-center">
              <input 
                type="checkbox"
                checked={defaults.categories?.includes(category) || false}
                onChange={(e) => {
                  const currentCategories = defaults.categories || [];
                  if (e.target.checked) {
                    setDefaults({
                      ...defaults,
                      categories: [...currentCategories, category]
                    });
                  } else {
                    setDefaults({
                      ...defaults,
                      categories: currentCategories.filter(c => c !== category)
                    });
                  }
                }}
              />
              {formatCategory(category)}
            </label>
          ))}
        </div>

        <button type="submit">Save Defaults</button>
      </div>
    </form>
  );
};
```

## Best Practices

### 1. Progressive Enhancement
- Start with basic age-based filtering
- Allow parents to gradually build more specific preferences
- Don't overwhelm with too many options initially

### 2. Smart Defaults
```typescript
// Example of intelligent defaults based on child's age
const getAgeBasedDefaults = (age: number): Partial<DefaultChildFilter> => {
  if (age <= 3) {
    return {
      supervisionLevel: 'one_on_one_required',
      maxDuration: 15,
      messLevel: 'minimal'
    };
  } else if (age <= 6) {
    return {
      supervisionLevel: 'active_supervision',
      maxDuration: 30,
      messLevel: 'moderate'
    };
  } else {
    return {
      supervisionLevel: 'minimal_supervision',
      maxDuration: 60,
      messLevel: 'moderate'
    };
  }
};
```

### 3. Feedback Loop
- Track which activities children enjoy
- Automatically suggest filter adjustments
- Learn from parent's manual filter changes

### 4. Multiple Children Support
```typescript
// Handle switching between children
const handleChildSwitch = (newChild: Child, currentFilters: ActivityFilters) => {
  // Save any manual adjustments to current child's preferences
  if (selectedChild && hasUserMadeChanges(currentFilters, selectedChild)) {
    suggestSavingAsDefaults(selectedChild, currentFilters);
  }
  
  // Load new child's defaults
  const newDefaults = createDefaultFilterFromChild(newChild);
  setFilters(newDefaults);
  setSelectedChild(newChild);
};
```

## Example User Flows

### Setting Up a New Child
1. Parent creates child profile
2. System suggests age-appropriate defaults
3. Parent customizes preferences (mess level, supervision, etc.)
4. Defaults are saved to child's profile

### Daily Activity Browsing
1. Parent opens app and selects child
2. Default filters are automatically applied
3. Activities are filtered based on child's preferences
4. Parent can adjust filters for current session
5. System learns from adjustments for future suggestions

### Managing Multiple Children
1. Parent switches between children using child selector
2. Each child's filters are automatically loaded
3. Recent filter changes can be saved as new defaults
4. Siblings can inherit similar preferences with one-click

## Troubleshooting

### Common Issues

**Child defaults not applying:**
- Check that `defaultFilter` is properly saved in database
- Verify `createDefaultFilterFromChild()` is called on child selection
- Ensure filter state is updated after child selection

**Age filtering not working:**
- Verify birthday format is correct (YYYY-MM-DD)
- Check `calculateChildAge()` function implementation
- Confirm activities have valid `targetAgeRange` data

**Filter conflicts:**
- Review merge logic in `mergeWithChildDefaults()`
- Check that UI properly reflects applied filters
- Verify filter state updates don't override child defaults

## API Reference

### Utility Functions

#### `createDefaultFilterFromChild(child)`
Converts child profile into filter object
- **Input**: Child object with birthday and defaultFilter
- **Output**: ActivityFilters object ready for UI
- **Features**: Auto-calculates age range, applies saved preferences

#### `calculateChildAge(birthday)`
Calculates current age from birthday string
- **Input**: Birthday string (YYYY-MM-DD)
- **Output**: Age in years (number)

#### `mergeWithChildDefaults(currentFilters, childDefaults)`
Combines user selections with child defaults
- **Input**: Current filter state and child's default filters
- **Output**: Merged filter object
- **Behavior**: User selections override defaults, preserves search terms

This documentation provides a complete guide for implementing and using the child default filters feature effectively.