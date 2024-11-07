process.env.NODE_ENV === 'production' ? 3000 : 8080

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});