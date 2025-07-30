const { crmPool } = require('../libraries/database');
const { logMessage } = require('../libraries/logger'); 
const bcrypt = require('bcryptjs')

const getAllSitesQuery = async () => {
    try {
        const response = await crmPool.query(`
            SELECT a.site_id, a.site_name, b.category_id, b.category_name, a.isactive, a.contact_person, a.contactno, a.email, a.address, a.city  
            FROM sites a 
            left join categories b on a.category = b.category_id`);
        if (response.rows.length === 0) {
            throw new Error('No sites found');
        }
        return response.rows;
    } catch (error) {
        logMessage(`Error fetching sites:${error}`, 'error'); 
        throw error;
    }
}

const addSiteQuery = async (siteData) => { 
    try {
        const { name, isActive, contactName, contactNo, email, address, city, category } = siteData;
        if (!name.trim()) {
            throw new Error('Site name is required');
        }
        const response = await crmPool.query(
            'INSERT INTO sites (site_id, site_name, isactive, contact_person, contactno, email, address, city, category) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, isActive, contactName, contactNo, email, address, city, category]
        );
        return response.rows[0];
    } catch (error) {
        logMessage(`Error adding site:${error}`, 'error'); 
        throw error;
    }
}

const editSiteQuery = async (siteData) => {
    try {
        const { id, name, isActive, contactName, contactNo, email, address, city, category } = siteData;
        if (!name.trim()) {
            throw new Error('Site name is required');
        }
        const response = await crmPool.query(
            'UPDATE sites SET site_name = $1, isactive = $2, contact_person = $3, contactno = $4, email = $5, address = $6, city = $7, category = $8 WHERE site_id = $9 RETURNING *',
            [name, isActive, contactName, contactNo, email, address, city, category, id]
        );
        if (response.rows.length === 0) {
            throw new Error('No site found with the given ID');
        }
        return response.rows[0];
    } catch (error) {
        logMessage(`Error editing site:${error}`, 'error'); // Use logMessage for consistency
        throw error;
    }
}

const getAllCategoriesQuery = async () => {
    try {
        const response = await crmPool.query('SELECT * FROM categories');
        if (response.rows.length === 0) {
            throw new Error('No categories found for the given user');
        }
        return response.rows;
    } catch (error) {
        logMessage(`Error fetching categories:${error}`, 'error');
        throw error;
    }
}

const getAllUsersQuery = async () => {
    try {
        const response = await crmPool.query(`
            SELECT u.*, ARRAY_AGG(usa.site_id) AS site_ids
            FROM users u
            LEFT JOIN user_site_access usa ON u.users_id = usa.users_id
            GROUP BY u.users_id
            `);
        return response.rows;
    } catch (error) {
        logMessage(`Error fetching users:${error}`, 'error');
        throw error;
    }
}  

const getUserAccessServices = async (user_id) => {
    try {
        const resp = await crmPool.query('select site_id from user_site_access WHERE users_id = $1', [user_id])
        return resp.rows
    } catch (error) {
        logMessage(`Error while getting the user Access Details: ${error}`, 'ERROR')
        throw new Error
    }
}

// const addNewUserQuery = async (userData) => {  
//     const userId = userData.userId;
//     try {
//         const { name, role, email, password, is_active } = userData;
//         const hashedPassword = password ? bcrypt.hashSync(password, 10) : null; // Hash password if provided
//             if (!hashedPassword) {
//                 throw new Error('Password is required');
//             }

//             if (!name.trim()) {
//                 throw new Error('User name is required');
//             }
//         const response = await crmPool.query(
//             'INSERT INTO users (name, role, email, password_hash, is_active, createdon, createdby) VALUES ($1, $2, $3, $4, $5, now(), $6) RETURNING *',
//             [name, role, email, hashedPassword, is_active, userId]
//         );
//         return response.rows[0];
//     } catch (error) {
//         logMessage(`Error adding user:${error}`, 'error');
//         throw error;
//     }
// }

// const editUserQuery = async (userData) => {
//     const userId = userData.userId;
//     try {
//         const { id, name, role, email, is_active } = userData;
//         if (!name.trim()) {
//             throw new Error('User name is required');
//         }
//         const response = await crmPool.query(
//             'UPDATE users SET name = $1, role = $2, email = $3, is_active = $4, modifiedon = now(), modifiedby = $6 WHERE users_id = $5 RETURNING *',
//             [name, role, email, is_active, id, userId]
//         );
//         if (response.rows.length === 0) {
//             throw new Error('No user found with the given ID');
//         }
//         return response.rows[0];
//     } catch (error) {
//         logMessage(`Error editing user:${error}`, 'error');
//         throw error;
//     }
// }

// Add a new user with site assignments
const addNewUserQuery = async (userData) => {
  const client = await crmPool.connect();
  try {
    await client.query('BEGIN');
    const { userId, name, role, email, password, is_active, site_ids } = userData;
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;
    if (!hashedPassword) {
      throw new Error('Password is required');
    }
    if (!name.trim()) {
      throw new Error('User name is required');
    }

    // Insert into users table
    const userResponse = await client.query(
      'INSERT INTO users (name, role, email, password_hash, is_active, createdon, createdby) VALUES ($1, $2, $3, $4, $5, now(), $6) RETURNING *',
      [name, role, email, hashedPassword, is_active, userId]
    );
    const newUser = userResponse.rows[0];

    // Insert into user_site_access table
    if (site_ids && Array.isArray(site_ids) && site_ids.length > 0) {
      const values = site_ids.map((site_id) => `(${newUser.users_id}, ${site_id}, ${userId}, ${userId})`).join(',');
      await client.query(`INSERT INTO user_site_access (users_id, site_id, createdby, modifiedby) VALUES ${values}`);
    }

    await client.query('COMMIT');
    return { ...newUser, site_ids: site_ids || [] };
  } catch (error) {
    await client.query('ROLLBACK');
    logMessage(`Error adding user: ${error}`, 'error');
    throw error;
  } finally {
    client.release();
  }
};

// Edit an existing user with site assignments
const editUserQuery = async (userData) => {
  const client = await crmPool.connect();
  try {
    await client.query('BEGIN');
    const { userId, id, name, role, email, is_active, site_ids } = userData;
    if (!name.trim()) {
      throw new Error('User name is required');
    }

    // Update users table
    const userResponse = await client.query(
      'UPDATE users SET name = $1, role = $2, email = $3, is_active = $4, modifiedon = now(), modifiedby = $6 WHERE users_id = $5 RETURNING *',
      [name, role, email, is_active, id, userId]
    );
    if (userResponse.rows.length === 0) {
      throw new Error('No user found with the given ID');
    }
    const updatedUser = userResponse.rows[0];

    // Update user_site_access table
    await client.query('DELETE FROM user_site_access WHERE users_id = $1', [id]);
    if (site_ids && Array.isArray(site_ids) && site_ids.length > 0) {
      const values = site_ids.map((site_id) => `(${id}, ${site_id}, ${userId})`).join(',');
      await client.query(`INSERT INTO user_site_access (users_id, site_id, modifiedby) VALUES ${values}`);
    }

    await client.query('COMMIT');
    return { ...updatedUser, site_ids: site_ids || [] };
  } catch (error) {
    await client.query('ROLLBACK');
    logMessage(`Error editing user: ${error}`, 'error');
    throw error;
  } finally {
    client.release();
  }
};

const getSiteQuestionQuery = async (site_id) => {
    try {
        const sites = await crmPool.query('SELECT * FROM questions WHERE category_id in (SELECT category from sites WHERE site_id = $1)', [site_id])
        return sites.rows
    } catch (error) {
        logMessage(`Error while fetching questions`, 'ERROR');
        throw new Error('No Questions found');
    }
}

const getSelectedQuestionsQuery = async (site_id) => {
    try {
        const selectedques = await crmPool.query('SELECT * FROM selected_sitequestions WHERE site_id = $1', [site_id]);
        return selectedques.rows
    } catch (error) {
        logMessage('error while fetching selected questions', 'ERROR');
        throw new Error('error while fetching the selected questions')
    }
}

const getSiteFBQuestionQuery = async (site_id) => {
    try {
        const result = await crmPool.query('SELECT a.id, a.site_id, a.question_id, b.question_text FROM selected_sitequestions AS a LEFT JOIN questions AS b ON a.question_id = b.question_id WHERE site_id = $1', [site_id])
        return result.rows
    } catch (error) {
        logMessage('error while fetching fedbackform Qeustions', 'ERROR')
        throw new Error(error.message)
    }
}

const updateSelectedQuestions = async ({ user, siteId, selectedIds }) => {
    try {
        // Delete old entries
        await crmPool.query(
            'DELETE FROM selected_sitequestions WHERE site_id = $1',
            [siteId]
        );

        if (!selectedIds || selectedIds.length === 0) {
            return [];
        }

        // Build dynamic insert query
        const values = [];
        const params = [];

        selectedIds.forEach((questionId, idx) => {
            const baseIndex = idx * 4;
            values.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`);
            params.push(siteId, questionId, user.userId, user.userId);
        });

        const insertQuery = `
            INSERT INTO selected_sitequestions (site_id, question_id, createdby, modifiedby)
            VALUES ${values.join(', ')}
            RETURNING *
        `
        ;

        const addNew = await crmPool.query(insertQuery, params);

        logMessage(`Site question list updated by ${user.name} for site ${siteId}`, 'INFO');
        return addNew.rows;

    } catch (error) {
        logMessage(`Error while updating selected questions by ${user.name}: ${error.message}`, 'ERROR');
        throw error;
    }
};

const getSiteNameQuery = async (site_id) => {
    try {
        const result = await crmPool.query('SELECT site_name FROM sites WHERE site_id = $1', [site_id])
        return result.rows
    } catch (error) {
        logMessage(`Error while geting site name`, 'ERROR')
        throw error
    }
}

const getSiteEmail = async () => {
    try {
        const response = await crmPool.query(`
            SELECT site_name as name, email FROM sites`);
        if (response.rows.length === 0) {
            throw new Error('No sites found');
        }
        return response.rows;
    } catch (error) {
        logMessage(`Error fetching sites:${error}`, 'error'); 
        throw error;
    }
}

module.exports = {
    getAllSitesQuery,
    addSiteQuery, // Updated function name
    editSiteQuery,
    getAllUsersQuery,
    getAllCategoriesQuery,
    addNewUserQuery,
    editUserQuery,
    getSiteEmail,
    getSiteQuestionQuery,
    getSelectedQuestionsQuery,
    updateSelectedQuestions,
    getSiteFBQuestionQuery,
    getSiteNameQuery,
    getUserAccessServices
};
