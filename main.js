document.addEventListener('DOMContentLoaded', () => {
  fetchSchemas();
  
  document.getElementById('login-button').addEventListener('click', (e) => {
    e.preventDefault();
    if (window.netlifyIdentity) {
      if (netlifyIdentity.currentUser()) {
        netlifyIdentity.logout();
      } else {
        netlifyIdentity.open();
      }
    }
  });
});

async function fetchSchemas() {
  try {
    const response = await fetch('/schemas/index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const schemaIndex = await response.json();
    displaySchemas(schemaIndex);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    const schemaList = document.getElementById('schema-list');
    schemaList.innerHTML = `
      <div class="alert alert-warning" role="alert">
        No schemas found. 
        ${netlifyIdentity.currentUser() ? 'Visit the <a href="/admin">admin dashboard</a> to add schemas.' : 'Login to add schemas.'}
      </div>
    `;
  }
}

function displaySchemas(schemas) {
  const schemaList = document.getElementById('schema-list');
  
  if (!schemas || schemas.length === 0) {
    schemaList.innerHTML = `
      <div class="alert alert-warning" role="alert">
        No schemas found. 
        ${netlifyIdentity.currentUser() ? 'Visit the <a href="/admin">admin dashboard</a> to add schemas.' : 'Login to add schemas.'}
      </div>
    `;
    return;
  }
  
  schemaList.innerHTML = '';
  
  // Create a table to display schemas
  const table = document.createElement('table');
  table.className = 'table table-striped table-hover';
  
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Version</th>
      <th>Type</th>
      <th>Status</th>
      <th>Last Updated</th>
      <th>Actions</th>
    </tr>
  `;
  
  const tbody = document.createElement('tbody');
  
  schemas.forEach(schema => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${schema.schema_name}</td>
      <td>${schema.version}</td>
      <td>${schema.schema_type}</td>
      <td>${schema.approved ? '<span class="badge bg-success">Approved</span>' : '<span class="badge bg-warning">Pending</span>'}</td>
      <td>${formatDate(schema.updated_at)}</td>
      <td>
        <button class="btn btn-sm btn-info view-schema" data-schema-path="${schema.path}">View</button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(thead);
  table.appendChild(tbody);
  schemaList.appendChild(table);
  
  // Add event listeners to view buttons
  document.querySelectorAll('.view-schema').forEach(button => {
    button.addEventListener('click', () => viewSchema(button.dataset.schemaPath));
  });
}

async function viewSchema(schemaPath) {
  try {
    const response = await fetch(schemaPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const schema = await response.json();
    
    // Populate modal with schema details
    document.getElementById('detail-name').textContent = schema.schema_name;
    document.getElementById('detail-version').textContent = schema.version;
    document.getElementById('detail-type').textContent = schema.schema_type;
    document.getElementById('detail-approved').textContent = schema.approved ? 'Yes' : 'No';
    document.getElementById('detail-created').textContent = formatDate(schema.created_at);
    document.getElementById('detail-updated').textContent = formatDate(schema.updated_at);
    
    // Format and display the schema JSON
    const schemaContent = document.getElementById('detail-schema');
    try {
      // Parse the schema if it's a string
      const schemaObj = typeof schema.schema === 'string' ? JSON.parse(schema.schema) : schema.schema;
      const formatter = new JSONFormatter(schemaObj, 2, { theme: 'dark' });
      schemaContent.innerHTML = '';
      schemaContent.appendChild(formatter.render());
    } catch (e) {
      schemaContent.textContent = JSON.stringify(schema.schema, null, 2);
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('schemaModal'));
    modal.show();
    
  } catch (error) {
    console.error('Error fetching schema details:', error);
    alert('Error loading schema details. Please try again.');
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
} 