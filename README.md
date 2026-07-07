# Frontend Setup

The frontend application is built using **React.js with Vite**.

## 1. Dependency Installation

Install all required dependencies by running:

```bash
npm install
```

## 2. Environment Configuration

Create a `.env` file in the root directory and add the API URL:

```env
VITE_API_URL=http://localhost:8000/bs
```

## 3. Architecture Overview

The frontend follows a structured component-based architecture.

* Built with **React.js + Vite**
* Uses an **atomic design structure**:

  * **Atoms**: Reusable basic UI components
  * **Components/Molecules**: Combined UI elements
  * **Pages**: Application-level views
* Data fetching and state synchronization are handled using **TanStack React Query**.
* API communication is managed through reusable service layers.

## Future Improvements

1. Add task history tracking
2. Implement notification functionality
3. Add task assignment features for users
4. Introduce team management features
5. Add project management functionality

  