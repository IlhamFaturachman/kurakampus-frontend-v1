/**
 * Example Component Test: BaseButton
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/common/BaseButton.vue';

describe('BaseButton', () => {
    it('renders slot content', () => {
        const wrapper = mount(BaseButton, {
            slots: {
                default: 'Click me',
            },
        });

        expect(wrapper.text()).toContain('Click me');
    });

    it('emits click event when clicked', async () => {
        const wrapper = mount(BaseButton);

        await wrapper.trigger('click');

        expect(wrapper.emitted('click')).toBeTruthy();
        expect(wrapper.emitted('click')?.length).toBe(1);
    });

    it('applies primary color by default', () => {
        const wrapper = mount(BaseButton);
        const button = wrapper.find('button');

        expect(button.classes()).toContain('bg-primary');
    });

    it('applies custom color when provided', () => {
        const wrapper = mount(BaseButton, {
            props: {
                color: 'secondary',
            },
        });
        const button = wrapper.find('button');

        expect(button.classes()).toContain('bg-secondary');
    });

    it('shows loading state', () => {
        const wrapper = mount(BaseButton, {
            props: {
                loading: true,
            },
        });

        expect(wrapper.find('.q-spinner').exists()).toBe(true);
    });

    it('disables button when disabled prop is true', () => {
        const wrapper = mount(BaseButton, {
            props: {
                disable: true,
            },
        });
        const button = wrapper.find('button');

        expect(button.attributes('disabled')).toBeDefined();
    });

    it('applies size classes correctly', () => {
        const wrapper = mount(BaseButton, {
            props: {
                size: 'lg',
            },
        });
        const button = wrapper.find('button');

        expect(button.classes()).toContain('text-lg');
    });
});
