import { makeStyles } from '@material-ui/core/styles';

const getStyles = () => {
    return makeStyles(theme => ({
        loginBody: {
            margin: 20,
        },
        loginPaper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary
        },
        loginButton: {
            marginRight: 5,
            marginLeft: 5
        },
        loginTextField: {
            width: 80 + '%'
        },
        passwordStrengthBar: {
            marginRight: 15 + '%',
            marginLeft: 15 + '%',
            marginTop: 2 + '%',
        }
    }))();
};

export default getStyles;