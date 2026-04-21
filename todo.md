- auth
    --forget password
    --verify account[done]

- user 
    -- get profile [done]
    -- update profile [done]
    -- delete profile[soft-delete]

- message 
    -- send message [anonymous-public]
    -- get all messages
    -- get specific message

- tokens-refresh tokens [done]
- revoke tokens [done]
    -- logout from specific device
    -- logout from all devices

- middlewares
    -- authentication >> check tokens >> check is login [done]
    -- authorization >> check permissions on APIs
    -- validation [done]
    -- upload files [profile-pic] - [multer]    [done]

- integrations
    -- login with google [done]
    -- send otp  [done]
    -- cashing redis[done]
    --rate limiting
    --helmet
    -- cors policy

- rollback hanling[done]