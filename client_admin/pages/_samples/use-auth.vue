<template>
    <Page title="Sample: composable useAuth and related">
        <VCard>
            <VRow>
                <VCol cols="12" lg="12" sm="12">
                    <VCardText>
                        <div>login token: {{ loginToken }}</div>
                        <div>is authenticated: {{ isAuthenticated }}</div>
                        <div>login info: {{ loginInfo }}</div>
                    </VCardText>
                    <VCardActions>
                        <VBtn color="primary" variant="outlined" @click="setLoginToken('dummy')">
                            Set Login token
                        </VBtn>
                        <VBtn
                            color="info"
                            variant="outlined"
                            @click="fetchLoginInfo()"
                        >
                            Fetch Login Info
                        </VBtn>
                        <VBtn color="error" variant="outlined" @click="clearAll()">
                            Clear All
                        </VBtn>
                    </VCardActions>
                </VCol>
            </VRow>
        </VCard>
    </Page>
</template>

<script setup lang="ts">

const {
    loginToken,
    clearLoginToken,
    clearLoginInfo,
    setLoginToken,
    isAuthenticated,
} = useAuth();
const { fetchLoginInfo, loginInfo } = useLoginInfo({ autoFetch: false });

const clearAll = () => {
    clearLoginToken();
    clearLoginInfo();
};

</script>
