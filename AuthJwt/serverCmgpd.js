const lookUpDataList=[
    { key : 1,value:"aadhar Number"},
    { key : 2,value:"phone Number"},
    { key : 3,value:"account Number"}
]

const cmgpd=async(req,res)=>{
    try {
        return res.json({ status:true ,message:[{code:"1002",description:"data retrieve successfully"}],lookUp:lookUpDataList}).status(200)
    } catch (error) {
        return res.json({ status:false ,message:[{code:"error",description:"Internal Server Problem"}]}).status(500)
    }
}

module.exports = cmgpd;