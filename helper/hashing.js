const bcrypt=require("bcrypt");
const saltRounds=10;

const hashGenerator= async (plainPassword) =>{
     const salt =await bcrypt.genSalt(saltRounds);
     const hash=await bcrypt.hash(plainPassword,salt);
     return hash;
}

const hashValidate= async(plainPassword,hashPassword) => {
    const result=await bcrypt.compare(plainPassword,hashPassword);
    return result;
}

module.exports.hashGenerator=hashGenerator;
module.exports.hashValidate=hashValidate;