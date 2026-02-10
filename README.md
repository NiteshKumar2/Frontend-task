Rishihood frontend task:

/------------------------

Setup Instructions:
1.git clone <your-repo-url>
2.cd <your-repo-folder>
3.npm install
4.Set up environment variables: .env.local (NEXT_PUBLIC_BASEURL=https://6986e8828bacd1d773ec025a.mockapi.io/)
5.npm run dev

/-------------------------

Features Implemented :
1. Fetch Users: Retrieve the list of users from the API
2. Add User: Add a new user with name, email, role, and status
3. Edit User: Inline edit user details directly in the table
4. Delete User: Delete a single user with confirmation dialog
5. Search Users: Search by name, email or role
6. Sort Users: Click the Name column header to sort users in ascending or descending order by name
7. Select Users: Select individual or all users using checkboxes
8. Pagination: Paginate users with customizable items per page
9. Status Display: Display active/inactive status with colors
10. Redux Toolkit: Manage state with slices and async thunks
11. Async Thunks: Handle API calls with createAsyncThunk for fetch, add, update, and delete
12. UI Components: Built with custom components (Table, Input, Button, AlertDialog, etc.)

 /---------------------------
 
mockapi.io Endpoints Used : https://6986e8828bacd1d773ec025a.mockapi.io/users
