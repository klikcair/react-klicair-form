import React from 'react';
import { Story, Meta } from '@storybook/react';
import ToggleSwitch, { ToggleSwitchProps } from '../../components/atoms/ToggleSwitch';

export default {
  title: 'Components/Atoms/ToggleSwitch',
  component: ToggleSwitch,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ToggleSwitchProps> = (args) => <ToggleSwitch {...args} />;

const defaultProps: ToggleSwitchProps = {
  disabled: false,
  switchOn: false,
  onChangeHandler: (e) => console.log(e.target.checked),
};

export const Normal = Template.bind({});
Normal.args = { ...defaultProps };

export const Checked = Template.bind({});
Checked.args = {
  ...Normal.args,
  switchOn: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Normal.args,
  disabled: true,
};