import { Platform } from 'react-native';
import AddressAutocompleteWeb from './AddressAutocomplete.web';
import AddressAutocompleteNative from './AddressAutocomplete.native';

const AddressAutocomplete =
  Platform.OS === 'web' ? AddressAutocompleteWeb : AddressAutocompleteNative;

export default AddressAutocomplete;