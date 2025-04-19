# Refarch

A utility website to build reference architectures for applications and organizations.

## Features

### Phase 1
- [ ] Create a new reference architecture
  - [ ] Architecture canvas
  - [ ] Architecture configuration panel
  - [ ] Populate architecture canvas with components
- [ ] From config file (generate a reference architecture from a TOML file)

### Phase 2
- [ ] View all reference architectures
- [ ] View a reference architecture
- [ ] Delete a reference architecture
- [ ] Update a reference architecture
- [ ] Reference architecture to markdown AI rules (turn your reference architecture into a set of AI rules)
- [ ] Save a reference architecture as a template
- [ ] Filter by cloud provider
- [ ] Filter by industry
- [ ] By influencer
- [ ] By function
- [ ] By application type

# Create a new reference architecture
Creating a new reference architecture is as simple as selecting architecture components across different layers of the stack. These are grouped into categories like presentation, application logic, data layer and infrastructure. Each of these layers should have a series of toggles. For example, the presentation layer should have a web and mobile toggle. 

## Architecture canvas

The architecture canvas should be able to show multiple applications on the canvas. These applications should be collapsible. The canvas should also be able to support a shared components across applications. 

## Architecture configuration panel
The architecture component should enable the user to select an application and populate the application's architecture with the different layers of the architecture. Each application should have a unique name and description and have independent architectures. Each application should have toggles for each layer. Each layer should have a series of component category toggles. Each component category should have a series of components.

There should be a section for frameworks and libraries that when toggled highlights the parts of the achitecture that are managed or affected by the framework or library.

# Tech stack

## Frontend [Phase 1]
- [ ] Next.js 15
- [ ] Tailwind CSS 4
- [ ] Shadcn UI 1.0
- [ ] TypeScript
- [ ] State management (Zustand)

## Backend [Phase 2 Only]
- [ ] Database (MongoDB)
- [ ] ORM (Mongoose)

## Supporting Libraries / Services
- [ ] Canvas/Diagramming Library (e.g., React Flow) [Phase 1]
- [ ] Authentication (Clerk) [Phase 2 Only]

# Hosting
- [ ] Vercel
- [ ] MongoDB Atlas
- [ ] Clerk