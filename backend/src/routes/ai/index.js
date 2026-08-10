import {Router} from 'express'
import chartRouter from './chat.js'
// import configRouter from './config.js'
// import promptsRouter from './prompts.js'
// import agentsRouter from './agents.js'

const router = Router()

router.use('/chat',chartRouter)
// router.use('/config',configRouter)
// router.use('/prompts',promptsRouter)
// router.use('/agents',agentsRouter)

export default router