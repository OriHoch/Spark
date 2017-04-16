// to enable the mock logins - set SPARK_ENABLE_MOCK_LOGINS=true in your .env file

module.exports = {
    "test@example.com": {
        "id": 5,
        "password": "123456",
        "drupal_user": {
            "user": {
                "uid": 5,
                "created": 12345678,
                "data": {
                    "tickets": {
                        "tickets": []
                    }
                },
                "field_profile_first": {"und": {"0": {"value": "first name"}}},
                "field_profile_last": {"und": {"0": {"value": "last name"}}},
                "field_profile_phone": {"und": {"0": {"value": "03-5555555"}}},
                "field_profile_address": {"und": {"0": {
                    "first_name": "address first name",
                    "last_name": "address last name",
                    "thoroughfare": "street",
                    "locality": "city",
                    "country": "country"
                }}},
                "field_sex": {"und": {"0": {"value": "other"}}},
                "field_field_profile_document_id": {"und": {"0": {"value": ""}}},
                "field_profile_birth_date": {"und": {"0": {"value": ""}}}
            }
        }
    }
};
