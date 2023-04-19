const { Prisma } = require("@prisma/client")
import prisma from "utils/dbConnection"

import bcryptjs from "bcryptjs"

function requireAuth(handler) {
    return async (req, res) => {
      
      const isAuthenticated = bcryptjs.compareSync("APIs", req.body.apiKey)
  
      if (isAuthenticated) {
        return await handler(req, res)
      }
  
      res.status(401).json({
        message: "Unauthorized"
      })
    }
}

async function handler(req, res) {

    const { landId, cnic } = req.body

    const checkLandQuery = await prisma.$queryRaw(Prisma.sql`Select 
    
    jsonb_build_object(
        'type', 'Feature',
        'land_id', land_id,
        'geometry', ST_AsGeoJSON(ST_FlipCoordinates(geom))::jsonb,
        'properties', json_build_object(
            'land_id', land_id,
            'name', name,
            'type', type,
            'perimeter', shape_leng,
            'area', shape_area
        )
    ) as landJson
    
    from plots where land_id = ${landId} and usercnic = ${cnic}`)
    
    if(checkLandQuery.length>0) {
        res.json({
            status: true,
            message: "Land verified!",
            landJson: checkLandQuery[0].landjson
        })
    }
    else {
        res.json({
            status: false,
            message: "Land does not exist!",
            landJson: null
        })
    }

}

export default requireAuth(handler)