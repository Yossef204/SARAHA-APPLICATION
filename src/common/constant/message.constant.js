const generateMessage = (entity)=>{
    return {
        alreadyExists : `${entity} already exists`,
        notFound : `${entity} not found`,
        createdSuccessfully : `${entity} created successfully`,
        updated : `${entity} updated successfully`,
        deleted : `${entity} deleted successfully`,
        failToCreate : `fail to create ${entity}`,
        failToUpdate : `fail to update ${entity}`,
        failToDelete : `fail to delete ${entity}`
    }
}



export const SYS_MESSAGE = {
    user : generateMessage("User"),
    message:generateMessage("message"),
    product: generateMessage("Product"),
    category: generateMessage("Category"),
    brand : generateMessage("Brand")
};