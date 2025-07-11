# Validation:

```typescript
import { validateInitData } from "max-validate-init-data";

const initData = "auth_date%3D1733485316394%26query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d";
const botToken = "2Uk3Z_8zAlwhprgOcK3r1B1fDk8uhi2MDv47EvXkcu8";

const { data, error } = validateInitData({
    initData,
    botToken,
})

if (error) {
    console.error(error);
    return;
}

console.log(data); // this will get you the entire parsed and validated initData object

```


# Parse:
```typescript
import { parseInitData } from "max-validate-init-data";

const initData = "auth_date%3D1733485316394%26query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d";

const { data, error } = parseInitData(initData);

if (error) {
    console.error(error);
    return;
}

console.log(data); // init data is here once again

```
