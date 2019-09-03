import { Modal, Text, View } from 'react-native';
import { GenericNavProp } from '../components/screenWrapper.web';
import pushRoute from './push-route';
import { NavLayout, NavLayoutStackChildren, NavModal, NavOptions } from '../types';

export default class NavigationWrapper {
  modals: NavModal[];
  constructor() {
    this.modals = [];
  }
  async push(props: GenericNavProp, layout: NavLayout): Promise<any> {
    pushRoute('test', props.history, props.appConfig);
  }
  async pop(props: GenericNavProp, options?: NavOptions): Promise<any> {
    props.history.goBack();
  }
  async popToRoot(props: GenericNavProp, options?: NavOptions): Promise<any> {
    pushRoute(props.appConfig.screenWeb, props.history, props.appConfig);
  }
  async popTo(props: GenericNavProp, options?: NavOptions): Promise<any> {
    pushRoute('test', props.history, props.appConfig);
  }
  async setStackRoot(props: GenericNavProp, layout: NavLayout): Promise<any> {
    pushRoute('test', props.history, props.appConfig);
  }
  async showStackedModal(layout: NavLayout | NavLayoutStackChildren): Promise<any> {
    if (layout.component) {
      this.modals.push({
        layout
      });
    }

    // stack: {
    //   children: [{
    //     component: {
    //       name: 'SignIn',
    //       passProps: {
    //         dismissible: true,
    //         onDismiss: (componentId: string) => () => {
    //           Navigation.dismissModal(componentId)
    //           .catch(e => console.warn('DISMISSMODAL error: ', e));
    //         },
    //         onSignInSuccess: (componentId: string) => () => {
    //           Navigation.dismissModal(componentId)
    //           .catch(e => console.warn('DISMISSMODAL error: ', e));
    //         }
    //       }
    //     }
    //   }]
    // }

    // component: {
    //   name: 'SignIn',
    //   passProps: {
    //     dismissible: true,
    //     onDismiss: () => {
    //       Navigation.dismissModal(this.props.componentId)
    //         .catch(e => console.warn('DISMISSMODAL error: ', e));
    //     },
    //     onSignInSuccess: () => {
    //       Navigation.popToRoot(this.props.componentId)
    //         .catch(e => console.warn('POPTOROOT error: ', e));
    //       Navigation.push(this.props.componentId, {
    //         component: {
    //           name: 'ProductDetail',
    //           passProps: {
    //             productId: this.props.id
    //           }
    //         }
    //       }).catch(e => console.warn('ProductDetail PUSH error: ', e));
    //       Navigation.dismissModal(this.props.componentId)
    //         .catch(e => console.warn('DISMISSMODAL error: ', e));
    //     }
    //   }
    // }
  }

  async showModal(layout: NavLayout): Promise<any> {
    if (layout.stack && layout.stack.children) {
      layout.stack.children.forEach(async (child: any) => {
        return this.showModal(child);
      });
    }
    return this.showStackedModal(layout);
  }
  async dismissModal(props: GenericNavProp, options?: NavOptions): Promise<any> {
    this.modals.pop();
  }
  async dismissAllModals(options?: NavOptions): Promise<any> {
    this.modals = [];
  }
  mergeOptions(props: GenericNavProp, options: NavOptions): void {
    // Not applicible to web
    return;
  }
  renderModals(): JSX.Element[] {
    return this.modals.map((modal: NavModal, index: number) => {
      return (
        <Modal key={'modal' + index}>
          {modal.layout.component && modal.layout.component.options &&
            modal.layout.component.options.topBar &&
            modal.layout.component.options.topBar.title &&
            modal.layout.component.options.topBar.title.text ? (
              <Text>{modal.layout.component.options.topBar.title.text}</Text>
            ) : null}
          <View/>
        </Modal>
      );
    });
  }
}
