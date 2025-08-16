import { Platform } from 'react-native';
import AddressAutocompleteWeb from './AddressAutocompleteWeb';
import AddressAutocompleteMovil from './AddressAutocompleteMovil';

const AddressAutocomplete =
  Platform.OS === 'web' ? AddressAutocompleteWeb : AddressAutocompleteMovil;

export default AddressAutocomplete;