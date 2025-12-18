
### Authentication
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/register` - Register user

### Users (Protected - Admin only)
- `GET /api/users?q=search&limit=50` - List/search users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Books (Read: public, Write: admin)
- `GET /api/books?q=search` - List/search books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (admin)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

### Transactions (Protected - Admin only)
- `GET /api/transactions?q=search&status=issued` - List transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions/issue` - Issue book
- `POST /api/transactions/return/:id` - Return book
- `DELETE /api/transactions/:id` - Delete transaction

**Auth Header (for protected routes):**
```
Authorization: Bearer <jwt_token>
```

## 🛡️ Security Features

- **JWT Authentication**: Token-based auth with 24h expiry
- **Password Hashing**: bcrypt with 10 rounds
- **SQL Injection Protection**: Parameterized queries
- **Role-based Access**: Admin/Librarian/User roles
- **CORS**: Configured for local dev
- **Input Validation**: Server-side validation with Joi

## 🐛 Troubleshooting

### Database Connection Failed
```powershell
# Check MySQL service
Get-Service MySQL*

# Start if stopped
Start-Service MySQL80

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

### Login Fails
- Verify admin user exists: `SELECT * FROM users WHERE role='admin';`
- Check JWT_SECRET is set in `.env`
- Ensure password was bcrypt-hashed

### "User not found" after search
- Verify user ID exists in database
- Try searching by username instead
- Check database connection

## 🔧 Development

### Run in Development Mode
```powershell
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

### Build for Production
```powershell
# Frontend build
cd client
npm run build
# Output: client/dist/

# Backend (no build needed)
cd server
npm start
```

## 🌟 Feature Highlights

1. **Smart Search**: Search by ID, name, or any field
2. **Modal Views**: Detailed info without page navigation
3. **Inline Editing**: Edit records with validation
4. **Confirmation Dialogs**: Safe deletion with prompts
5. **Status Badges**: Visual indicators for book availability and overdue status
6. **Responsive Design**: Works on desktop and tablet
7. **Real-time Updates**: Data refreshes after operations
8. **Role Management**: Admin can assign user roles
9. **Fine Tracking**: Automatic fine calculation for overdue books
10. **Dashboard Stats**: Quick overview of library status

## 📚 Example Workflows

### Workflow: Issue a Book to User
1. Admin goes to **Users** page
2. Searches user by name or ID (e.g., "John" or "5")
3. Notes the User ID from the table
4. Goes to **Books** page
5. Searches for available book (checks Available column > 0)
6. Notes the Book ID
7. Goes to **Transactions** page
8. Clicks "📖 Issue Book"
9. Enters User ID and Book ID
10. Sets due date (default 14 days)
11. Submits - book is issued!

### Workflow: Return an Overdue Book
1. Admin goes to **Transactions** page
2. Filters by status: "Issued"
3. Finds overdue transaction (red "Overdue" badge)
4. Clicks "Return" button
5. Enters fine amount (e.g., $2.50)
6. Confirms return
7. Book availability is updated automatically

## 🚀 Future Enhancements

- [ ] Book cover image uploads
- [ ] Email notifications for overdue
- [ ] Advanced filters and sorting
- [ ] Export reports (PDF/Excel)
- [ ] User borrowing history page
- [ ] Book reservation system
- [ ] Barcode/QR code scanning
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Multi-language support

## 📄 License

This project is for educational purposes.

## 🙏 Credits

Built with ❤️ for efficient library management

---

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review API endpoint documentation
- Verify database setup
- Check browser console for errors
- Ensure both server and client are running

**Quick Health Check:**
```powershell
# Backend health
Invoke-RestMethod http://localhost:3000/api/health

# Frontend (open in browser)
# http://localhost:5173
```

---

**Made with Node.js, React, and MySQL** 🚀
