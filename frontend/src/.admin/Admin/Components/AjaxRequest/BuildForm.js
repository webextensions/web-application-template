import React from 'react';
import PropTypes from 'prop-types';

import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

import * as styles from './BuildForm.css';

const BuildForm = ({ requestConfig, onFormChange }) => {
    const form = requestConfig.form;
    const schema = form.schema;

    const uiSchema = {
        ...form.uiSchema,
        'ui:submitButtonOptions': {
            norender: true
        }
    };

    const formData = form.formData;

    const onChange = function (result, id) {
        onFormChange({
            formData: result.formData,
            result,
            formChangeId: id
        });
    };

    return (
        <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={onChange}
            validator={validator}
            className={styles.ajaxForm}
        />
    );
};
BuildForm.propTypes = {
    requestConfig: PropTypes.object.isRequired,
    onFormChange: PropTypes.func.isRequired
};

export { BuildForm };
