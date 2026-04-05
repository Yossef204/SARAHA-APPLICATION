- auth
    --forget password
    --verify account

- user 
    -- get profile
    -- update profile
    -- delete profile[soft-delete]

- message 
    -- send message [anonymous-public]
    -- get all messages
    -- get specific message

- tokens-refresh tokens [done]

- middlewares
    -- authentication >> check tokens >> check is login [done]
    -- authorization >> check permissions on APIs
    -- validation [done]
    -- upload files [profile-pic] - [multer]

- integrations
    -- login with google
    -- send otp  
    -- cashing redis
    --rate limiting
    --helmet
    -- cors policy

- rollback hanling