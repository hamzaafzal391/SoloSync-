I have enabled Firestore and my .env is ready. Let's build the Dashboard functionality for Step 3.

Data Logic: In the Dashboard, create a form to add a transaction: Title, Amount (as a number), and Type (Income or Debt). Save these to a Firestore collection called 'transactions'.

UI Components:

Create a Table to display all transactions fetched from Firestore.

Add a Delete button for each row and an Edit function (CRUD).

Add a Search Bar above the table that filters the list by title as I type.

Sync: Ensure the Redux store stays updated when data changes.

Human Code: Use simple logic, Tailwind for styling, and strictly no comments. Use react-hot-toast for success/error notifications."