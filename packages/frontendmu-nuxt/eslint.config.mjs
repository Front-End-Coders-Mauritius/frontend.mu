// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        "vue/first-attribute-linebreak": 'off',
        'vue/require-default-prop': 'off',
        'vue/no-mutating-props': 'off',
        'vue/no-template-shadow': 'off',
        'vue/no-multiple-template-root': 'off',
        "@typescript-eslint/no-explicit-any": 'off',
        "@typescript-eslint/no-unused-vars": 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
    }
})