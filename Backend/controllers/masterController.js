const { logMessage } = require("../libraries/logger");
const { getAllSitesQuery, addSiteQuery, editSiteQuery, getAllCategoriesQuery, getAllUsersQuery, addNewUserQuery, editUserQuery, getSiteQuestionQuery, getSelectedQuestionsQuery, updateSelectedQuestions, getSiteFBQuestionQuery, getSiteNameQuery } = require("../services/masterQueryServices");


const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsersQuery();
        res.status(200).json({
            status: 'success',
            data: users
        });
        logMessage(`Fetched all users ${req.user.name}`, 'Info'); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch users'
        });
        logMessage(`Error fetching users: ${error.message}`, 'Error');
    }
}

const addSiteController = async (rec, res) => {
    
    const { name, isActive, contactName, contactNo, category, email, address, city } = rec.body;
    if (!name.trim()) {
        throw new Error('Site name is required');
    }
    try {
        const result = await addSiteQuery({
            name,
            isActive,
            contactName,
            contactNo,
            category, 
            email,
            address,
            city
        });
        res.status(200).json({
            status: 'success',
            message: 'Site added successfully',
            data: result
        });
        logMessage(`Site ${name} added successfully by ${rec.user.name}`, 'Info'); 
    } catch (error) {
        console.error('Error adding site:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to add site'
        });
        logMessage(`Error adding site: ${error.message}`, 'Error');
    }
}

const editSiteController = async (rec, res) => {
    const { id, name, isActive, contactName, contactNo, category, email, address, city } = rec.body;
    
    if (!name.trim()) {
        throw new Error('Site name is required');
    }
    try {
        const result = await editSiteQuery({
            id,
            name,
            isActive,
            contactName,
            contactNo,
            category,
            email,
            address,
            city
        });
        res.status(200).json({
            status: 'success',
            message: 'Site updated successfully',
            data: result
        });
        logMessage(`Site ${name} updated successfully by ${rec.user.name}`, 'Info');
    } catch (error) {
        console.error('Error editing site:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update site'
        });
        logMessage(`Error editing site: ${error.message}`, 'Error');
    }
}

const getAllSitesController = async (req, res) => {
    try {
        const sites = await getAllSitesQuery();
        res.status(200).json({
            status: 'success',
            data: sites
        });
        logMessage(`Fetched all sites by ${req.user.name}`, 'Info');
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch sites'
        });
        logMessage(`Error fetching sites: ${error.message}`, 'Error');
    }
}

const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await getAllCategoriesQuery();
        res.status(200).json({
            status: 'success',
            data: categories
        });
        logMessage(`Fetched all categories by ${req.user.name}`, 'Info');
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch categories'
        });
        logMessage(`Error fetching categories: ${error.message}`, 'Error');
    }
}

// Add a new user with site assignments
const addNewUserController = async (req, res) => {
  const reqUser = req.user.data;
  const { name, role, email, password, is_active, site_ids } = req.body;
  if (!name.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'User name is required'
    });
  }
  try {
    const result = await addNewUserQuery({
      userId: reqUser.userId,
      name,
      role,
      email,
      password,
      is_active,
      site_ids 
    });
    res.status(200).json({
      status: 'success',
      message: 'User added successfully',
      data: result
    });
    logMessage(`User ${reqUser.name} added a new user: ${name}`, 'Info');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to add user'
    });
    logMessage(`Error adding user: ${error.message}`, 'Error');
  }
};

// Edit an existing user with site assignments
const editUserController = async (req, res) => {
  const { id, name, role, email, is_active, site_ids } = req.body;
  const reqUser = req.user.data;
  if (!name.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'User name is required'
    });
  }
  try {
    const result = await editUserQuery({
      userId: reqUser.userId,
      id,
      name,
      role,
      email,
      is_active,
      site_ids 
    });
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: result
    });
    logMessage(`User ${name} updated successfully by ${reqUser.name}`, 'Info');
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update user'
    });
    logMessage(`Error editing user: ${error.message}`, 'Error');
  }
};


const getSiteQuestionController = async (req, res) => {
    const site_id = req.query.site_id
    try {
        const allQuestions = await getSiteQuestionQuery(site_id)
        const selectedQuestions = await getSelectedQuestionsQuery(site_id)

        const selectedIds = selectedQuestions.map(q => q.question_id);

        const response = allQuestions.map(q => ({
            ...q,
            selected: selectedIds.includes(q.question_id)
        }));

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: response
        });
    } catch (error) {
        console.error('error fetching SiteQuestions', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'failed to fetch site questions'
        });
    }
}

const selectedQuestionscontroller = async (rec, res) => {
    const user = rec.user.data
    const {siteId, selectedIds} = rec.body;
    try {
        const updateQuestions = await updateSelectedQuestions({user, siteId, selectedIds})
        res.status(200).json({
            status: 'success',
            message: 'Selected Questions Updated successfully',
            data: updateQuestions
        });
    } catch (error) {
        console.error('error while adding selected Questions', error)
        res.status(500).json({
            status: 'Error',
            message: error.message || 'error while updating selected questions'
        })
    }
}

const getSiteOnlyQController = async (rec, res) => {
    const site_id = rec.query.siteId
    try {
        const selectedQuestions = await getSiteFBQuestionQuery(site_id)
        res.status(200).json({
            status: 'success',
            message: 'Fetched data successfully',
            data: selectedQuestions
        })
    } catch (error) {
        console.error('error while getting selected Questions', error) 
        res.status(500).json({
           status: 'Error',
            message: error.message || 'error while fetching selected questions' 
        })
    }
}

const getSiteNameController = async (rec, res) => {
    const site_id = rec.query.siteId
    try {
        const siteName = await getSiteNameQuery(site_id)
        res.status(200).json({
            status: 'success',
            message: 'fetched Site Name',
            data: siteName
        })
    } catch (error) {
       res.status(500).json({
           status: 'Error',
            message: error.message || 'error while fetching selected questions' 
        }) 
    }
}

module.exports = {
    getAllUsersController,
    addSiteController,
    editSiteController,
    getAllSitesController,
    getAllCategoriesController,
    addNewUserController,
    editUserController,
    getSiteQuestionController,
    selectedQuestionscontroller,
    getSiteOnlyQController,
    getSiteNameController
};