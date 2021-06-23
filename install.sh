#!/bin/bash

# script to install and configure the app
echo "This script will walk you through the installation of the app."
echo
echo "Requirements:"
echo "   - This installer is only designed for linux computers. For Windows, one should use WSL. It may or may not work on Mac."
echo "   - Python must be installed."
echo "   - Pip must be installed."
echo
echo "All python packages will be installed in a virtual environment."
echo

# ask for permission to proceed
while true; do
	read -p "Proceed? [Y/n]: " yn
	case $yn in 
		[Yy]*|"") echo "Proceeding..."; break;;
		[Nn]*) echo "Aborting..."; exit 1;;
	esac
done

python="python"
pip="pip"

while true; do
	read -p "Use pip3 instead of pip? [Y/n]" yn
	case $yn in 
		[Yy]*|"") python="python3"; pip="pip3"; break;;
		[Nn]*) break;;
	esac
done

if [[ $($pip list | grep -wi virtualenv) = "" ]]
then
  echo "installing virtualenv..."
  if [[ $(hostname | grep flip) != "" ]]
  then
    $pip install --user virtualenv
  else
    $pip install virtualenv
  fi
fi

echo "Building virtual environment..."
$python -m venv ./venv

echo "Activating virtual environment via source ./venv/bin/activate..."
source ./venv/bin/activate

echo "Please verify that the source is ok (it should not be like /usr/bin/python"
which python

# ask for permission to proceed
while true; do
	read -p "Is the source as expected? [Y/n]: " yn
	case $yn in 
		[Yy]*|"") echo "Proceeding..."; break;;
		[Nn]*) echo "Aborting...please continue manually, or retry..."; exit 1;;
	esac
done

echo "Installing requirements..."
$pip install -r requirements.txt

# echo "Installing flask-mysqldb..."
# $pip install flask-mysqldb

echo "Please verify that the flask is ok (it should show a version):"
flask --version

# ask for permission to proceed
while true; do
	read -p "Is the flask as expected? [Y/n]: " yn
	case $yn in 
		[Yy]*|"") echo "Proceeding..."; break;;
		[Nn]*) echo "Aborting...please continue manually, or retry..."; exit 1;;
	esac
done

# echo "Installing gunicorn..."
# $pip install gunicorn

# echo "Installing python-dotenv..."
# $pip install python-dotenv


# TODO: put some database stuff on a database?

echo "Remember to run"
echo "source ./venv/bin/activate"
echo "to enter the virtual environment"
echo
echo "Type deactivate to exit the virtual environment."
echo
echo "The app should now run when you type"
echo "$python app.py"
echo
echo "Goodbye!"
echo 
