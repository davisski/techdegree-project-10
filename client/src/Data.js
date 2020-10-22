import config from "./config";
import axios from "axios";


/**
 * @class {Data}
 * @method {api} - Returns API call with axios.
 * @method {getUser} - Get user from database.
 * @method {createUser} - Create new user and store to database.
 * @method {getCourses} - Get all courses from database.
 * @method {getCourseById} - Get specific course by its id from database.
 * @method {createCourse} - Create new course and store to database.
 * @method {updateCourse} - Update specific course properties and then save to database.
 * @method {deleteCourse} - Delete course from database.
 */
export default class Data {
    /**
     * 
     * @param {String} path - URI ('/courses/:id', '/courses', '/users') 
     * @param {String} method - HTTP methods ('post', 'get', 'put', 'delete')
     * @param {Object} body - Default null, body object from request body. 
     * @param {Boolean} requiresAuth - Default false, if specific route needs authorization then true. 
     * @param {Object} credentials - Default null, if requires authorization, then will need user username and password. 
     */
    api(path, method = 'get', body = null, requiresAuth = false, credentials = null){
        // full api url
        const url = config.apiBaseUrl + path;
        // axios config
        const options = {
            method,
            url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        // if body not null
        if(body !== null){
            options.data = body;
        }
        // if requires auth 
        if(requiresAuth){
            const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;  
        }

        return axios(options);
    }
    /**
     * 
     * @param {String} username - Username from input 
     * @param {String} password - Password from input
     * GET user
     */
    async getUser(username, password){
        try{
            const response = await this.api('/users', 'get', null, true, {username, password});
            if(response.status === 200){
                return response.data.user;
            }
        }catch(error){
            throw error;
        }
    }
    /**
     * 
     * @param {Object} user - User object with all properties
     * POST user 
     */
    async createUser(user){
       
        try {
            const response = await this.api('/users', 'post', user);
            if(response.status === 201){
                return [];
            } 
        } catch (error) {
            throw error;
        }
        
    }
    /**
     * GET all courses
     */
    async getCourses(){

        try {
            const response = await this.api('/courses', 'get', null);
            if(response.status === 200){
                return response.data.courses;
            }     
        } catch (error) {
            throw error;            
        }

    }
    /**
     * 
     * @param {Number} id - Identifier for specific course
     * GET course
     *  
     */
    async getCourseById(id){
        try {
            const response = await this.api(`/courses/${id}`, 'get', null);
            if(response.status === 200){
                return response.data.course;
            }
        } catch (error) {
           throw error;
        }
    }
    /**
     * 
     * @param {Object} course - Newly created course object with all properties 
     * @param {Object} user - Authenticated user object
     * POST course
     */
    async createCourse(course, user){
        try {
            // object destructuring 
            // emailAddress as username
            const {emailAddress: username, password} = user;
            const response = await this.api('/courses', 'post', course, true, {username, password});
            if(response.status === 201){
                return response;
            }
        } catch (error) {
            throw error;
        }   
    }
    /**
     * 
     * @param {Number} id - Specific identifier for course who need to update 
     * @param {Object} course - Updated course object with all properties
     * @param {Object} user - Authenticated user object
     * PUT course 
     */
    async updateCourse(id, course, user){
        try {
            // object destructuring 
            // emailAddress as username
            const {emailAddress: username, password} = user;
            const response = await this.api(`/courses/${id}`, 'put', course, true, {username, password})
            if(response.status === 204){
                return [];
            }
        } catch (error) {
           throw error;
        }
    }
    /**
     * 
     * @param {Number} id - Specific identifier for course who tryin to delete 
     * @param {Object} user - Authenticated user object
     * DELETE course 
     */
    async deleteCourse(id, user){
        try {
            // object destructuring 
            // emailAddress as username
            const {emailAddress: username, password} = user;
            const response = await this.api(`/courses/${id}`, 'delete', null, true, {username, password});
            if(response.status === 204){
                return [];
            }
        } catch (error) {
            throw error;
        }
    }   
}