﻿using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nulobe.Jobs.BlobStorageBackup
{
    public class AzureBlobStorageService
    {
        private readonly AzureStorageOptions _azureStorageAccountOptions;
        private readonly ILogger _logger;
        
        private CloudBlobClient _cloudBlobClient;

        public AzureBlobStorageService(
            IOptions<AzureStorageOptions> azureStorageAccountOptions,
            ILogger<AzureBlobStorageService> logger)
        {
            _azureStorageAccountOptions = azureStorageAccountOptions.Value;
            _logger = logger;
        }

        public string StorageName { get; set; }

        public async Task<string> UploadAsync(FileStorageData fileStorageData)
        {
            _logger.LogInformation("Uploading name {0} to container {1}", fileStorageData.Name, "ProdCopy");

            CloudBlobContainer container;
            try
            {
                container = await EnsureCloudBlobContainer();
            }
            catch (Exception ex)
            {
                _logger.LogError(0, ex, ex.Message);
                throw ex;
            }

            var filePath =  string.Join("/", fileStorageData.KeyParts.Concat(fileStorageData.Name));
            var blockBlob = container.GetBlockBlobReference(filePath);
            blockBlob.Properties.ContentType = fileStorageData.ContentType;
            var bytes = fileStorageData.Stream;
            await blockBlob.UploadFromStreamAsync(fileStorageData.Stream);

            _logger.LogInformation("Uploaded name {0} to container {1}, full path {2}", fileStorageData.Name, "ProdCopy", blockBlob.Uri);

            return blockBlob.Uri.ToString();
        }

        public async Task<FileStorageData> GetAsync(string filePath)
        {
            _logger.LogInformation("Retrieve file from path {0} in container {1}", filePath, "ProdCopy");

            var relativePath = string.Concat((new Uri(filePath)).Segments.Skip(2));

            var container = await EnsureCloudBlobContainer();
            var blockBlob = container.GetBlockBlobReference(relativePath);

            var fileStorageData = new FileStorageData
            {
                Stream = blockBlob.OpenRead()
            };

            fileStorageData.Name = Path.GetFileName(blockBlob.Name);
            fileStorageData.KeyParts = Path.GetDirectoryName(blockBlob.Name).Split('/');
            fileStorageData.ContentType = blockBlob.Properties.ContentType;
            fileStorageData.Length = blockBlob.Properties.Length;

            _logger.LogInformation("Retrieved file {0} from container {1}, full path {2}", fileStorageData.Name, "ProdCopy", blockBlob.Uri);

            return fileStorageData;
        }

        #region Helpers

        private async Task<CloudBlobContainer> EnsureCloudBlobContainer()
        {
            var blobClient = EnsureCloudBlobClient();

            var container = blobClient.GetContainerReference("prodcopy");

            if (await container.CreateIfNotExistsAsync())
            {
                await container.SetPermissionsAsync(
                    new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    });
            }

            return container;
        }

        private CloudBlobClient EnsureCloudBlobClient()
        {
            if (_cloudBlobClient == null)
            {
                var authOptions = _azureStorageAccountOptions.Auth;
                var storageAccount = CloudStorageAccount.Parse("UseDevelopmentStorage=true;");
                //var storageAccount = CloudStorageAccount.Parse(_azureStorageAccountOptions.ConnectionString);
                //var storageAccount = new CloudStorageAccount(new StorageCredentials(authOptions.AccountName, authOptions.AccountKey), false);
                _logger.LogInformation($"Creating blob client at uri {storageAccount.BlobEndpoint}");
                _cloudBlobClient = storageAccount.CreateCloudBlobClient();
            }

            return _cloudBlobClient;
        }

        #endregion
    }
}