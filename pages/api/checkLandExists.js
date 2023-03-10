import conn from "utils/dbConnection"

export default async function handler(req, res) {

    const { landId, cnic } = req.body

    const checkLandQuery = await conn.query(`Select *, 
    
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
    
    from plots where land_id = $1 and usercnic = $2`, [landId, cnic])
    
    if(checkLandQuery.rows.length>0) {
        res.json({
            status: true,
            message: "Land verified!",
            landJson: checkLandQuery.rows[0].landjson
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