# Resources & Amenities Module

This module provides comprehensive management of club resources (courts, rooms) and amenities for the clubs service.

## 🏗️ Architecture

### Entities

- **Resource**: Manages individual resources like courts, rooms, etc.
- **Amenity**: Manages club amenities with boolean flags

### Services

- **ResourceService**: CRUD operations for resources
- **AmenityService**: CRUD operations for amenities

### Resolvers

- **ResourceResolver**: GraphQL mutations and queries for resources
- **AmenityResolver**: GraphQL mutations and queries for amenities

## 📋 Resource Management

### Resource Fields

- `title`: Resource name (e.g., "Court #1")
- `service`: Service type (Tennis, Padel, Squash, etc.)
- `type`: Indoor/Outdoor
- `property`: Surface type (Clay, Hard, Grass, etc.)
- `description`: Optional notes
- `enableOnlineBooking`: Boolean for online booking
- `color`: Hex color for calendar display
- `status`: Active/Inactive/Maintenance
- `clubId`: Reference to club

### Available GraphQL Operations

#### Mutations

```graphql
# Create a new resource
createResource(input: CreateResourceInput!): Resource!

# Update an existing resource
updateResource(id: String!, input: UpdateResourceInput!): Resource!

# Delete a resource
deleteResource(id: String!): Boolean!
```

#### Queries

```graphql
# Get all resources
getResources: [Resource!]!

# Get resources by club ID
getResourcesByClubId(clubId: String!): [Resource!]!

# Get single resource
getResource(id: String!): Resource

# Get resources by service type
getResourcesByService(service: String!): [Resource!]!

# Get resources by status
getResourcesByStatus(status: String!): [Resource!]!
```

## 🏢 Amenity Management

### Amenity Fields

All amenities are boolean flags:

- `restaurant`, `hotel`, `drinks`, `food`
- `hotShower`, `kidsRoom`, `wifi`, `bar`
- `changingRoom`, `parking`, `lockerRoom`
- `proShop`, `coaching`, `physiotherapy`, `massage`

### Available GraphQL Operations

#### Mutations

```graphql
# Create amenities for a club
createAmenity(input: CreateAmenityInput!): Amenity!

# Update amenities by ID
updateAmenity(id: String!, input: UpdateAmenityInput!): Amenity!

# Update amenities by club ID
updateAmenityByClubId(clubId: String!, input: UpdateAmenityInput!): Amenity!

# Delete amenities
deleteAmenity(id: String!): Boolean!
deleteAmenityByClubId(clubId: String!): Boolean!
```

#### Queries

```graphql
# Get all amenities
getAmenities: [Amenity!]!

# Get amenities by club ID
getAmenityByClubId(clubId: String!): Amenity

# Get single amenity
getAmenity(id: String!): Amenity
```

## 🔗 Club Integration

Both Resource and Amenity entities are linked to the Club entity:

- **Resource**: One-to-Many relationship (one club can have many resources)
- **Amenity**: One-to-One relationship (one club has one amenity record)

## ✅ Validation

### Resource Validation

- Title: Required, non-empty string
- Service: Must be valid enum value
- Type: Must be Indoor or Outdoor
- Property: Must be valid surface type
- Color: Must be valid hex color format (#RRGGBB or #RGB)
- ClubId: Must be valid UUID

### Amenity Validation

- ClubId: Must be valid UUID
- All amenity fields: Optional boolean values

## 🚀 Usage Examples

### Create a Tennis Court

```graphql
mutation {
  createResource(
    input: {
      title: "Court #1"
      service: TENNIS
      type: OUTDOOR
      property: CLAY
      description: "Main tennis court"
      enableOnlineBooking: true
      color: "#F1C231"
      status: ACTIVE
      clubId: "club-uuid-here"
    }
  ) {
    id
    title
    service
    type
    property
    color
    status
  }
}
```

### Update Club Amenities

```graphql
mutation {
  updateAmenityByClubId(
    clubId: "club-uuid-here"
    input: { restaurant: true, wifi: true, parking: true, changingRoom: true }
  ) {
    id
    restaurant
    wifi
    parking
    changingRoom
  }
}
```

## 📁 File Structure

```
src/modules/resources/
├── entities/
│   ├── resource.entity.ts
│   └── amenity.entity.ts
├── dto/
│   ├── create-resource.input.ts
│   ├── update-resource.input.ts
│   ├── create-amenity.input.ts
│   └── update-amenity.input.ts
├── services/
│   ├── resource.service.ts
│   └── amenity.service.ts
├── resolvers/
│   ├── resource.resolver.ts
│   └── amenity.resolver.ts
├── constants/
│   └── resource.constants.ts
├── resource.module.ts
├── amenity.module.ts
├── index.ts
└── README.md
```
