import {useAuth} from "../../../hooks/useAuth.js";
import useUserSettings from "../../../hooks/useUserSettings.js";
import {useState} from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Divider
} from '@mui/material';
import './Settings.css'


const SettingsPage = () => {
    const {user} = useAuth()
    const {updateProfile, changePassword, loading, error} = useUserSettings()

    const [profileForm, setProfileForm] = useState({
        username: user?.username,
        password: '',
        repeatPassword: '',
        name: user?.name,
        surname: user?.surname,
        role: '',
        organizationId: '',
    })


    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [successMessage, setSuccessMessage] = useState('')
    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordChange = (e) => {
        setPassForm({
            ...passForm,
            [e.target.name]: e.target.value
        })
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileForm)
            setSuccessMessage('Profile successfully updated')
            setTimeout(() => setSuccessMessage(''), 3000)
        }catch(error){
            console.log('Failed to update profile ', error);
        }
    }


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passForm)
            setSuccessMessage('Password changed successfully')
            setPassForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.log('Failed to update password ', err);
        }
    }

    return (
        <div className="settings-page">
            <Container maxWidth="md" className="settings-container">
                <Typography variant="h4" className="settings-title">
                    Settings
                </Typography>

                {successMessage && (
                    <Alert severity="success" className="settings-alert">
                        {successMessage}
                    </Alert>
                )}

                {/* Profile Section */}
                <Paper className="settings-card">
                    <Typography variant="h6" className="settings-card-title">
                        Profile Information
                    </Typography>
                    <Divider className="settings-divider" />

                    <form onSubmit={handleProfileSubmit} className="settings-form">
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            className="settings-input"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Surname"
                            name="surname"
                            value={profileForm.surname}
                            onChange={handleProfileChange}
                            className="settings-input"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            value={profileForm.username}
                            disabled
                            className="settings-input"
                            helperText="Username cannot be changed"
                        />
                        <TextField
                            fullWidth
                            label="Role"
                            value={profileForm.role}
                            disabled
                            className="settings-input"
                            helperText="Role is assigned by administrators"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            className="settings-submit-button"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Paper>

                {/* Password Section */}
                <Paper className="settings-card">
                    <Typography variant="h6" className="settings-card-title">
                        Change Password
                    </Typography>
                    <Divider className="settings-divider" />

                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                        <TextField
                            fullWidth
                            type="password"
                            label="Current Password"
                            name="currentPassword"
                            value={passForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="settings-input"
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="New Password"
                            name="newPassword"
                            value={passForm.newPassword}
                            onChange={handlePasswordChange}
                            className="settings-input"
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={passForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="settings-input"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            className="settings-submit-button settings-danger-button"
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}
export default SettingsPage;
