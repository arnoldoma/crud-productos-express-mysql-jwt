const { default: axios } = require('axios')
const {Router} = require('express')

const router = Router()

router.get('/posts', async (req, res)=>{
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    res.render('posts', { posts: response.data})
    console.log( response )
})

module.exports = router;