import { Navigation } from 'react-native-navigation';
import { GenericNavProp } from '../components/screenWrapper';
import { NavLayout, NavOptions } from '../types';

export default class NavigationWrapper {
  async push(props: GenericNavProp, layout: NavLayout): Promise<any> {
    return Navigation.push(props.componentId, layout);
  }
  async pop(props: GenericNavProp, options?: NavOptions): Promise<any> {
    return Navigation.pop(props.componentId, options);
  }
  async popToRoot(props: GenericNavProp, options?: NavOptions): Promise<any> {
    return Navigation.popToRoot(props.componentId, options);
  }
  async popTo(props: GenericNavProp, options?: NavOptions): Promise<any> {
    return Navigation.popTo(props.componentId, options);
  }
  async setStackRoot(props: GenericNavProp, layout: NavLayout): Promise<any> {
    return Navigation.setStackRoot(props.componentId, layout);
  }
  async showModal(layout: NavLayout): Promise<any> {
    return Navigation.showModal(layout);
  }
  async dismissModal(props: GenericNavProp, options?: NavOptions): Promise<any> {
    return Navigation.dismissModal(props.componentId, options);
  }
  async dismissAllModals(options?: NavOptions): Promise<any> {
    return Navigation.dismissAllModals(options);
  }
  mergeOptions(props: GenericNavProp, options: NavOptions): void {
    return Navigation.mergeOptions(props.componentId, options);
  }
  renderModals(): JSX.Element | null {
    return null;
  }
}
