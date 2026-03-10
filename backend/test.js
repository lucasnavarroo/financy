

async function testApi() {
    const url = 'http://localhost:4000/';

    async function graphqlRequest(query, variables = {}, token = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables })
        });
        return await res.json();
    }

    // 1. Register User 1
    console.log('--- Registering User 1 ---');
    let result = await graphqlRequest(`
    mutation {
      register(email: "test1@test.com", password: "password123") {
        token
        user { id email }
      }
    }
  `);
    console.log(JSON.stringify(result));
    const token1 = result.data.register.token;

    // 2. Create Category for User 1
    console.log('--- Creating Category for User 1 ---');
    result = await graphqlRequest(`
    mutation {
      createCategory(name: "Groceries") { id name userId }
    }
  `, {}, token1);
    console.log(JSON.stringify(result));
    const categoryId = result.data.createCategory.id;

    // 3. Create Transaction for User 1
    console.log('--- Creating Transaction for User 1 ---');
    result = await graphqlRequest(`
    mutation($categoryId: ID!) {
      createTransaction(title: "Supermarket", amount: 50.5, type: "EXPENSE", categoryId: $categoryId) {
        id title amount type categoryId userId
      }
    }
  `, { categoryId }, token1);
    console.log(JSON.stringify(result));

    // 4. Query Me for User 1
    console.log('--- Querying Me for User 1 ---');
    result = await graphqlRequest(`
    query {
      me {
        id email categories { name } transactions { title }
      }
    }
  `, {}, token1);
    console.log(JSON.stringify(result));

    // 5. Verify Isolation - User 2
    console.log('--- Registering User 2 ---');
    result = await graphqlRequest(`
    mutation {
      register(email: "test2@test.com", password: "password123") {
        token
      }
    }
  `);
    console.log(JSON.stringify(result));
    const token2 = result.data.register.token;

    console.log('--- Attempting to access User 1 Category as User 2 ---');
    result = await graphqlRequest(`
    mutation($categoryId: ID!) {
      updateCategory(id: $categoryId, name: "Hacked") {
        id name
      }
    }
  `, { categoryId }, token2);
    console.log(JSON.stringify(result));

    console.log('--- Attempting to create Transaction with User 1 Category as User 2 ---');
    result = await graphqlRequest(`
    mutation($categoryId: ID!) {
      createTransaction(title: "Hacked", amount: 100, type: "INCOME", categoryId: $categoryId) {
        id title
      }
    }
  `, { categoryId }, token2);
    console.log(JSON.stringify(result));

    console.log('Done testing.');
}

testApi();
