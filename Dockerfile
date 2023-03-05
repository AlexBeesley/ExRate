# Use a .NET 6 SDK image as the base image for building the API.
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS api-build

# Set the working directory
WORKDIR /app/api

# Copy the .NET API files into the container
COPY ./ExRate_API .

RUN dotnet restore

# Build the .NET API
RUN dotnet publish -c Release -o out && \
    test -f out/ExRate_API.dll




# Use a Python 3 image as the base image for building the Python script.
FROM python:3.10.9 AS python-build

# Set the working directory
WORKDIR /app/python

RUN pip install numpy
RUN pip install pandas
RUN pip install requests
RUN pip install python-dotenv
RUN pip install tensorflow
RUN pip install scikit-learn
RUN pip install keras
RUN pip install matplotlib

# Copy the Python script into the container
COPY ./ExRate_Service .




# Use a .NET 6 runtime image as the base image for the final image.
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final

# Set the working directory
WORKDIR /app

# Copy the built API and Python script into the container
COPY --from=api-build /app/api/out .
COPY --from=python-build /app/python .

# Install Python and its dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Expose the API port
EXPOSE 80

# Set the entrypoint to run the .NET API
ENTRYPOINT ["dotnet", "ExRate_API.dll"]
