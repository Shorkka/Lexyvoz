import React from 'react';
import { View } from 'react-native';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import LabelWithAsterisk from '@/presentation/theme/components/LabelWithAsterisk';

interface Props {
  direccion: string;
  numExterior: string;
  numInterior: string;
  colonia: string;
  codigoPostal: string;
  onChange: (field: string, value: string) => void;
}

const AddressForm: React.FC<Props> = ({
  direccion,
  numExterior,
  numInterior,
  colonia,
  codigoPostal,
  onChange,
}) => (
  <>
    <LabelWithAsterisk label="Dirección" required />
    <ThemedTextInput
      placeholder="Calle."
      style={{ borderBottomWidth: 1, borderColor: 'grey', fontSize: 16 }}
      autoCapitalize="words"
      value={direccion}
      onChangeText={(value) => onChange('direccion', value)}
    />

    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <View>
        <LabelWithAsterisk label="Número exterior" required />
        <ThemedTextInput
          placeholder=""
          style={{ borderBottomWidth: 1, borderColor: 'grey', fontSize: 16 }}
          value={numExterior}
          onChangeText={(value) => onChange('numExterior', value)}
        />
      </View>
      <View>
        <LabelWithAsterisk label="Número interior" />
        <ThemedTextInput
          placeholder=""
          style={{ borderBottomWidth: 1, borderColor: 'grey', fontSize: 16 }}
          value={numInterior}
          onChangeText={(value) => onChange('numInterior', value)}
        />
      </View>
      <View>
        <LabelWithAsterisk label="Código postal" required />
        <ThemedTextInput
          placeholder=""
          style={{ borderBottomWidth: 1, borderColor: 'grey', fontSize: 16 }}
          value={codigoPostal}
          onChangeText={(value) => onChange('codigoPostal', value)}
        />
      </View>
    </View>

    <LabelWithAsterisk label="Colonia" required />
    <ThemedTextInput
      placeholder="Colonia."
      style={{ borderBottomWidth: 1, borderColor: 'grey', fontSize: 16 }}
      autoCapitalize="words"
      value={colonia}
      onChangeText={(value) => onChange('colonia', value)}
    />
  </>
);

export default AddressForm;
