import express from 'express'
import { viewMyProfile, editMyProfile, deleteMyProfile } from '../../controllers/general/profile'

const router =  express.Router();

// "/" === /api/profile

router.route("/:id")
    .get( viewMyProfile )
    .patch( editMyProfile )
    .delete( deleteMyProfile )

export = router;