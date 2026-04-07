- auth
    --forget password
    --verify account

- user 
    -- get profile [done]
    -- update profile
    -- delete profile[soft-delete]

- message 
    -- send message [anonymous-public]
    -- get all messages
    -- get specific message

- tokens-refresh tokens [done]
- revoke tokens
    -- logout from specific device
    -- logout from all devices

- middlewares
    -- authentication >> check tokens >> check is login [done]
    -- authorization >> check permissions on APIs
    -- validation [done]
    -- upload files [profile-pic] - [multer]    [done]

- integrations
    -- login with google
    -- send otp  
    -- cashing redis
    --rate limiting
    --helmet
    -- cors policy

- rollback hanling