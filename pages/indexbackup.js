import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import Cookies from "js-cookie";
import Client from 'shopify-buy';

import api from "../utils/api";

import store from 'store-js';
// import api from "../utils/api";
import ResourceListWithProducts from '../components/ResourceList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  constructor(props){
    super(props);
  this.state = {
    open:false,
    products:[]
  }
  }
   getProducts = async () => {
    // const resposne  = await api.get("products.json?presentment_currencies=USD");
    const query1 = `
    {products(first:10){
      edges{
        node{
          id,
          title
        }
      }
    }
  }
    `
    const resposne  = await api.post("garphql.json",{query:JSON.stringify(query1)});

    this.setState({products:response.data},() => {
      console.log(response,"products list");
    });
    
  }
  componentDidMount = () => {
    this.getProducts();
    // import Cookies from "js-cookie";

    // console.log(this.props,"props");
    // const testCookie = Cookies.get("shopOrigin");
    const testCookie = store.get("shopCreds");
    console.log(testCookie,"testCookie");

  }
  render() {
    const emptyState = !store.get('ids');
    return (
      <Page>
        <TitleBar primaryAction={{
          content: 'Select products',
          onAction: () => this.setState({ open: true }),
        }} />
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={(resources) => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />
        {emptyState ? (
          <Layout>
            <EmptyState
              heading="Discount your products temporarily"
              action={{
                content: 'Select products',
                onAction: () => this.setState({ open: true }),
              }}
              image={img}
            >
              <p>Select products to change their price temporarily.</p>
            </EmptyState>
          </Layout>
        ) : (
            <ResourceListWithProducts />
          )}
      </Page>
    );
  }

  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
}

export default Index;
