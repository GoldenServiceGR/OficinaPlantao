import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, ListRenderItem, ScrollView, Dimensions } from 'react-native';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

interface ExpenseScreenProps {
  navigation: any;
}

interface SummaryScreenProps {
  route: any;
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

const ExpenseScreen: React.FC<ExpenseScreenProps> = ({ navigation }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    saveExpenses();
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses).map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date),
        }));

        const oneYearAgo = moment().subtract(1, 'year').toDate();
        const recentExpenses = parsedExpenses.filter(
          (expense: Expense) => expense.date >= oneYearAgo
        );

        setExpenses(recentExpenses);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
    }
  };

  const saveExpenses = async () => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Failed to save expenses:', error);
    }
  };

  const addExpense = () => {
    if (description && amount) {
      const newExpense: Expense = {
        id: Math.random().toString(),
        description,
        amount: parseFloat(amount),
        date: new Date(),
      };
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
    }
  };

  const renderExpenseItem: ListRenderItem<Expense> = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text>{moment(item.date).format('DD/MM/YYYY')}</Text>
      <Text>{item.description}</Text>
      <Text>{item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lançamento de Despesas</Text>
      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Valor"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <Button title="Adicionar Despesa" onPress={addExpense} color="#555" />
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Visualizar Gráficos"
        onPress={() => navigation.navigate('Summary', { expenses })}
        color="#555"
      />
    </View>
  );
};

const SummaryScreen: React.FC<SummaryScreenProps> = ({ route, navigation }) => {
  const expenses: Expense[] = route.params?.expenses || [];

  const totalPerDay = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
    const day = moment(expense.date).format('DD/MM');
    acc[day] = (acc[day] || 0) + expense.amount;
    return acc;
  }, {});

  const labels = Object.keys(totalPerDay);
  const dataValues = Object.values(totalPerDay);

  const hasData = labels.length > 0 && dataValues.length > 0;

  const data = {
    labels: hasData ? labels : ['Sem dados'],
    datasets: [
      {
        data: hasData ? dataValues : [0],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Resumo de Despesas</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel="R$"
        fromZero
        chartConfig={{
          backgroundColor: '#333',
          backgroundGradientFrom: '#555',
          backgroundGradientTo: '#777',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ccc',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
};

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Expenses"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#333',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Expenses" component={ExpenseScreen} options={{ title: 'Despesas' }} />
      <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: 'Resumo' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
