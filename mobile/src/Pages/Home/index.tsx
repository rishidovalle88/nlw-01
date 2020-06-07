import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface Uf {
  id: number;
  nome: string;
  sigla: string;
}

interface Ufaux {
  id: number;
  label: string;
  value: string;
}

interface CityAux {
  id: number;
  label: string;
  value: string;
}

interface City {
  nome: string;
}

interface placeholderC {
  label: string;
  value: string;
  color: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufsAux, setUfsAux] = useState<Ufaux[]>([]);
  const [cities, setCities] = useState<CityAux[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [placeholderc, setPlaceholderC] = useState<placeholderC>({
    label: "Selecione uma Cidade",
    value: "",
    color: "#9EA0A4",
  });

  useEffect(() => {
    if (ufsAux.length === 0) {
      axios
        .get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        )
        .then((response) => {
          response.data.map((item: Uf) =>
            setUfsAux((ufsAux) => [
              ...ufsAux,
              { id: item.id, label: item.nome, value: item.sigla },
            ])
          );
        });
    }
  }, []);

  useEffect(() => {
    setCities([]);
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        setPlaceholderC({ label: "Selecione uma Cidade" });
        response.data.map((item: City, index: number) =>
          setCities((cities) => [
            ...cities,
            { id: index, label: item.nome, value: item.nome },
          ])
        );
      });
  }, [selectedUf]);

  function handleSelectUf(ufName: string) {
    setSelectedUf(ufName);
    setPlaceholderC({ label: "Carregando..." });
  }

  function handleSelectCity(cityName: string) {    
    setSelectedCity(cityName);
  }

  function handleNavigateToPoints() {
    navigation.navigate("Points",{
      selectedUf,
      selectedCity
    });
  }

  const placeholder = {
    label: "Selecione um Estado",
    value: null,
    color: "#9EA0A4",
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding': undefined}>
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem posntos de coleta de forma eficiente.
          </Text>
        </View>

        <View>
          <RNPickerSelect
            placeholder={placeholder}
            style={pickerSelectStyles}
            onValueChange={handleSelectUf}
            items={ufsAux}
          />
          <RNPickerSelect
            placeholder={placeholderc}
            style={pickerSelectStyles}
            onValueChange={handleSelectCity}
            items={cities}
          />
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
