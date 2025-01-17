import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

const SignedInOrNot = ({
    WhenSignedIn,
    WhenSignedOut,
    WhenSignedLoading,
    WhenSignedError,
    WhenSignedUnknown
}) => {
    const { granularUserIsRegistered } = useAuth();

    switch (granularUserIsRegistered) {
        /* eslint-disable @stylistic/no-multi-spaces */
        case 'granular-loading': { return WhenSignedLoading; }
        case 'granular-error':   { return WhenSignedError;   }
        case 'granular-no':      { return WhenSignedOut;     }
        case 'granular-yes':     { return WhenSignedIn;      }
        case 'granular-unknown': // eslint-disable-line unicorn/no-useless-switch-case
        default:                 { return WhenSignedUnknown; }
        /* eslint-enable @stylistic/no-multi-spaces */
    }
};

export { SignedInOrNot };
